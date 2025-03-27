import { supabase } from '@/lib/supabase';
import { Document, DocumentCreateInput, DocumentUpdateInput } from '@/types/document';
import jsPDF from 'jspdf';
import { Document as DocxDocument, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

export interface SearchFilters {
  searchTerm?: string;
  status?: 'pending' | 'processing' | 'completed' | 'error' | 'analyzing';
  riskLevel?: 'low' | 'medium' | 'high';
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'date' | 'risk' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export const documentService = {
  async createDocument(input: DocumentCreateInput): Promise<{ data: Document | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async getDocuments(): Promise<{ data: Document[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async getDocument(id: string): Promise<{ data: Document | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // If we have analysis results, ensure they're properly mapped to the document fields
      if (data.analysis_result) {
        return {
          data: {
            ...data,
            riskScore: data.analysis_result.riskScore,
            clauses: data.analysis_result.clauses,
            summary: data.analysis_result.summary,
            jurisdiction: data.analysis_result.jurisdiction,
            keyFindings: data.analysis_result.keyFindings
          },
          error: null
        };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async updateDocument(id: string, input: DocumentUpdateInput): Promise<{ data: Document | null; error: Error | null }> {
    try {
      // If we have analysis results, update the document with all the analysis fields
      if (input.analysis_result) {
        const { data, error } = await supabase
          .from('documents')
          .update({
            status: 'completed',
            riskScore: input.analysis_result.riskScore,
            clauses: input.analysis_result.clauses,
            summary: input.analysis_result.summary,
            jurisdiction: input.analysis_result.jurisdiction,
            keyFindings: input.analysis_result.keyFindings,
            analysis_result: input.analysis_result
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return { data, error: null };
      }

      // For other updates, just update the specified fields
      const { data, error } = await supabase
        .from('documents')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  async deleteDocument(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  async uploadFile(file: File): Promise<{ path: string | null; error: Error | null }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      return { path: filePath, error: null };
    } catch (error) {
      return { path: null, error: error as Error };
    }
  },

  async searchDocuments(filters: SearchFilters): Promise<{ data: Document[] | null; error: Error | null }> {
    try {
      let query = supabase
        .from('documents')
        .select('*');

      // Apply filters
      if (filters.searchTerm) {
        query = query.ilike('title', `%${filters.searchTerm}%`);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.dateRange) {
        query = query
          .gte('created_at', filters.dateRange.start.toISOString())
          .lte('created_at', filters.dateRange.end.toISOString());
      }

      // Apply sorting
      if (filters.sortBy) {
        const sortColumn = filters.sortBy === 'date' ? 'created_at' : filters.sortBy;
        query = query.order(sortColumn, { ascending: filters.sortOrder === 'asc' });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      // Transform the data to match our Document type
      const transformedData = data?.map(doc => ({
        ...doc,
        date: doc.created_at || doc.date,
        status: doc.status || 'pending',
      }));

      return { data: transformedData || [], error: null };
    } catch (error) {
      console.error('Error in searchDocuments:', error);
      return { data: null, error: error as Error };
    }
  },

  async getDocumentAnalytics(): Promise<{
    totalDocuments: number;
    documentsByStatus: Record<string, number>;
    documentsByRisk: Record<string, number>;
    recentActivity: Document[];
  }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const documents = data || [];
      const totalDocuments = documents.length;
      const documentsByStatus = documents.reduce((acc, doc) => {
        acc[doc.status] = (acc[doc.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const documentsByRisk = documents.reduce((acc, doc) => {
        if (doc.riskScore) {
          const riskLevel = doc.riskScore < 30 ? 'low' : doc.riskScore < 70 ? 'medium' : 'high';
          acc[riskLevel] = (acc[riskLevel] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      return {
        totalDocuments,
        documentsByStatus,
        documentsByRisk,
        recentActivity: documents,
      };
    } catch (error) {
      throw error;
    }
  },

  generatePDF: (content: string, title: string) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 20, 20);
    doc.setFontSize(12);
    
    // Split content into lines that fit the page
    const splitText = doc.splitTextToSize(content, 170);
    
    // Add content with proper line spacing
    let y = 30;
    splitText.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 20, y);
      y += 7;
    });
    
    // Save the PDF
    doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
  },

  generateWord: async (content: string, title: string) => {
    const doc = new DocxDocument({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            spacing: {
              after: 200,
              line: 360,
            },
          }),
          ...content.split('\n\n').map(paragraph => 
            new Paragraph({
              children: [
                new TextRun({
                  text: paragraph,
                  size: 24,
                }),
              ],
              spacing: {
                after: 200,
                line: 360,
              },
            })
          ),
        ],
      }],
    });

    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, `${title.toLowerCase().replace(/\s+/g, '_')}.docx`);
  }
}; 
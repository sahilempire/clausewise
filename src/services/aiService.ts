import { retry } from '@/lib/utils';
import { AnalysisResult } from '@/api/ai';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Enable browser usage
});

export const aiService = {
  async analyzeText(text: string): Promise<AnalysisResult> {
    try {
      const prompt = `Analyze the following legal document and provide a structured analysis in JSON format. Include:
        1. Document title (extract or generate)
        2. Overall risk score (0-100)
        3. Number of key clauses identified
        4. A concise summary
        5. Jurisdiction (if mentioned)
        6. Key findings with:
           - Title
           - Description
           - Risk level (low/medium/high)
           - Relevant extracted text
           - Mitigation options

        Document text:
        ${text}

        Respond in this exact JSON format:
        {
          "documentTitle": "string",
          "riskScore": number,
          "clauses": number,
          "summary": "string",
          "jurisdiction": "string",
          "keyFindings": [
            {
              "title": "string",
              "description": "string",
              "riskLevel": "low" | "medium" | "high",
              "extractedText": "string",
              "mitigationOptions": ["string"]
            }
          ]
        }`;

      const response = await retry(
        async () => {
          const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
              {
                role: "system",
                content: "You are a legal document analysis AI. Analyze legal documents and provide structured insights."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
          });

          const result = JSON.parse(completion.choices[0].message.content || '{}') as AnalysisResult;
          return result;
        },
        3,
        1000
      );

      return response;
    } catch (error) {
      console.error('AI analysis error:', error);
      throw new Error('Failed to analyze document. Please try again.');
    }
  }
}; 
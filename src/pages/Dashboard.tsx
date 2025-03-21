
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "@/components/document/DocumentCard";
import { UploadArea } from "@/components/document/UploadArea";
import { useState } from "react";
import { ListFilter, Plus, Upload } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Sample data for documents
const sampleDocuments = [
  {
    id: "1",
    title: "Service Agreement",
    date: "2023-07-15",
    status: "completed" as const,
    riskScore: 25,
    clauses: 12,
  },
  {
    id: "2",
    title: "Non-Disclosure Agreement",
    date: "2023-08-03",
    status: "completed" as const,
    riskScore: 45,
    clauses: 8,
  },
  {
    id: "3",
    title: "Employment Contract",
    date: "2023-09-20",
    status: "analyzing" as const,
    progress: 65,
  },
];

const Dashboard = () => {
  const [documents, setDocuments] = useState(sampleDocuments);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleUpload = (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate file upload process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Add new document after upload completes
        const newDocId = `doc-${Date.now()}`;
        const newDoc = {
          id: newDocId,
          title: files[0].name.split('.')[0],
          date: new Date().toISOString(),
          status: "analyzing" as const,
          progress: 0,
        };
        
        setDocuments([newDoc, ...documents]);
        
        // Simulate analysis progress
        let analysisProgress = 0;
        const analysisInterval = setInterval(() => {
          analysisProgress += 5;
          
          setDocuments(docs => 
            docs.map(doc => 
              doc.id === newDocId 
                ? { ...doc, progress: analysisProgress }
                : doc
            )
          );
          
          if (analysisProgress >= 100) {
            clearInterval(analysisInterval);
            
            // Complete the analysis
            setTimeout(() => {
              setDocuments(docs => 
                docs.map(doc => 
                  doc.id === newDocId 
                    ? { 
                        ...doc, 
                        status: "completed" as const, 
                        riskScore: Math.floor(Math.random() * 100),
                        clauses: Math.floor(Math.random() * 15) + 5,
                      }
                    : doc
                )
              );
              
              toast({
                title: "Analysis completed",
                description: `Document "${files[0].name.split('.')[0]}" has been analyzed successfully.`,
              });
            }, 1000);
          }
        }, 300);
        
        setIsUploading(false);
        setIsUploadOpen(false);
        
        toast({
          title: "Document uploaded",
          description: "Your document is now being analyzed.",
        });
      }
    }, 300);
  };

  return (
    <AppLayout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage and analyze your legal documents
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1">
              <ListFilter className="h-4 w-4" />
              Filter
            </Button>
            <Button 
              size="sm" 
              className="gap-1 bg-primary-gradient hover:bg-primary-gradient-hover"
              onClick={() => setIsUploadOpen(true)}
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              New Analysis
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} {...doc} />
          ))}
        </div>
        
        {documents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No documents found. Upload your first document to get started.
            </p>
            <Button 
              onClick={() => setIsUploadOpen(true)}
              className="gap-1 bg-primary-gradient hover:bg-primary-gradient-hover"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </div>
        )}
      </div>
      
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload your legal document for AI-powered analysis
            </DialogDescription>
          </DialogHeader>
          
          {isUploading ? (
            <div className="py-6">
              <div className="mb-4 text-center">
                <p className="font-medium mb-2">Uploading document...</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Please wait while your document is being uploaded.
                </p>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm mt-2">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <UploadArea onUpload={handleUpload} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Dashboard;


import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, ArrowLeft, Download, FileText, Info, Sparkles } from "lucide-react";
import { Link, useParams } from "react-router-dom";

// Sample document data
const documentData = {
  "1": {
    id: "1",
    title: "Service Agreement",
    date: "2023-07-15",
    parties: ["Acme Corp.", "XYZ Services Ltd."],
    riskScore: 25,
    clauses: [
      {
        id: "clause-1",
        name: "Compensation",
        content: "Client agrees to compensate Provider at the rate of $150 per hour for Services rendered, payable within thirty (30) days of receipt of invoice.",
        riskLevel: "low",
        recommendation: "Standard compensation terms. No changes recommended.",
      },
      {
        id: "clause-2",
        name: "Termination",
        content: "Either party may terminate this Agreement with thirty (30) days written notice. Termination does not relieve Client of obligation to pay for services rendered prior to termination.",
        riskLevel: "medium",
        recommendation: "Consider extending notice period to 60 days for better transition planning.",
      },
      {
        id: "clause-3",
        name: "Intellectual Property",
        content: "All materials, developments, and work product resulting from Services shall be the sole and exclusive property of Provider. Provider grants Client a perpetual, non-exclusive license to use materials for internal business purposes only.",
        riskLevel: "high",
        recommendation: "High risk: Provider retains ownership of all work product. Negotiate for Client ownership, especially for custom deliverables.",
      },
    ],
  },
  "2": {
    id: "2",
    title: "Non-Disclosure Agreement",
    date: "2023-08-03",
    parties: ["ABC Innovations", "Secure Solutions Inc."],
    riskScore: 45,
    clauses: [
      {
        id: "clause-1",
        name: "Definition of Confidential Information",
        content: "\"Confidential Information\" means any non-public information that relates to the Disclosing Party's business, including but not limited to technical, marketing, financial, personnel, planning, and other information.",
        riskLevel: "low",
        recommendation: "Definition is properly broad. No changes recommended.",
      },
      {
        id: "clause-2",
        name: "Term of Obligation",
        content: "The obligations of confidentiality under this Agreement shall remain in effect for a period of three (3) years from the date of disclosure.",
        riskLevel: "medium",
        recommendation: "Consider whether 3 years is sufficient protection for your sensitive information. Many NDAs use 5 years or more.",
      },
      {
        id: "clause-3",
        name: "Non-Compete",
        content: "Recipient agrees not to engage in any business activity that directly competes with Disclosing Party for a period of two (2) years within the United States.",
        riskLevel: "high",
        recommendation: "High risk: Non-compete clause may be overly broad and unenforceable in some jurisdictions. Consider narrowing scope or removing entirely.",
      },
    ],
  },
};

const DocumentView = () => {
  const { id } = useParams<{ id: string }>();
  const document = id && documentData[id];
  
  if (!document) {
    return (
      <AppLayout>
        <div className="container px-4 py-16 mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The document you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/dashboard">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="h-6 border-l border-border"></div>
          <h1 className="text-2xl font-bold">{document.title}</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Document info */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Document Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Date</div>
                    <div>
                      {new Date(document.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Parties</div>
                    <div className="space-y-1">
                      {document.parties.map((party, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <div>{party}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Risk Assessment</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {document.riskScore < 30 
                            ? "Low Risk" 
                            : document.riskScore < 70 
                              ? "Medium Risk" 
                              : "High Risk"}
                        </span>
                        <span className="text-sm">{document.riskScore}/100</span>
                      </div>
                      <Progress 
                        value={document.riskScore} 
                        className="h-2"
                        indicatorClassName={
                          document.riskScore < 30 
                            ? "bg-success" 
                            : document.riskScore < 70 
                              ? "bg-warning" 
                              : "bg-destructive"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border p-4">
                <Button className="w-full gap-2" variant="outline">
                  <Download className="h-4 w-4" />
                  Download Analysis
                </Button>
              </div>
            </Card>
            
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Key Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Document Type</div>
                      <div className="text-sm text-muted-foreground">
                        {document.title.includes("Service") 
                          ? "Service Agreement" 
                          : document.title.includes("Non-Disclosure") 
                            ? "Non-Disclosure Agreement" 
                            : "Contract"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Info className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Clauses Identified</div>
                      <div className="text-sm text-muted-foreground">
                        {document.clauses.length} clauses found
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">High Risk Items</div>
                      <div className="text-sm text-muted-foreground">
                        {document.clauses.filter(c => c.riskLevel === "high").length} issues found
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Main content - Clauses */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="analysis">
              <TabsList className="mb-6">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analysis" className="space-y-6">
                <div className="space-y-4">
                  {document.clauses.map((clause) => (
                    <Card key={clause.id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">{clause.name}</h3>
                          <RiskBadge level={clause.riskLevel} />
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-4">
                          {clause.content}
                        </div>
                        
                        {clause.recommendation && (
                          <div className="bg-muted p-3 rounded-md flex gap-3">
                            <Sparkles className="h-5 w-5 text-secondary flex-shrink-0" />
                            <div className="text-sm">
                              <span className="font-medium">Recommendation: </span>
                              {clause.recommendation}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="summary">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Document Summary</h3>
                  <p className="text-muted-foreground mb-4">
                    This {document.title.toLowerCase()} establishes terms between {document.parties.join(" and ")}. 
                    The document contains {document.clauses.length} key clauses, including:
                  </p>
                  
                  <ul className="space-y-2 mb-4">
                    {document.clauses.map((clause) => (
                      <li key={clause.id} className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        </div>
                        <span>{clause.name}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <p className="text-muted-foreground">
                    Overall risk assessment indicates this is a 
                    {document.riskScore < 30 
                      ? " low-risk" 
                      : document.riskScore < 70 
                        ? " medium-risk" 
                        : " high-risk"} document with specific concerns in
                    {document.clauses
                      .filter(c => c.riskLevel === "high")
                      .map(c => ` ${c.name.toLowerCase()}`)}
                    {document.clauses.filter(c => c.riskLevel === "high").length === 0 
                      ? " no specific areas"
                      : ""}.
                  </p>
                </Card>
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Key Recommendations</h3>
                  
                  <div className="space-y-4">
                    {document.clauses
                      .filter(clause => clause.recommendation && clause.riskLevel !== "low")
                      .map((clause) => (
                        <div key={clause.id} className="p-4 rounded-lg border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{clause.name}</h4>
                            <RiskBadge level={clause.riskLevel} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {clause.content}
                          </p>
                          <div className="bg-muted p-3 rounded-md flex gap-3">
                            <Sparkles className="h-5 w-5 text-secondary flex-shrink-0" />
                            <div className="text-sm">
                              {clause.recommendation}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                    {document.clauses.filter(clause => clause.recommendation && clause.riskLevel !== "low").length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">
                          No significant issues found in this document.
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

function RiskBadge({ level }: { level: string }) {
  if (level === "low") {
    return (
      <Badge variant="outline" className="text-xs font-normal border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
        Low Risk
      </Badge>
    );
  }
  
  if (level === "medium") {
    return (
      <Badge variant="outline" className="text-xs font-normal border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
        Medium Risk
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="text-xs font-normal border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
      High Risk
    </Badge>
  );
}

export default DocumentView;


import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, FileText, ListChecks, Shield } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ModeToggle } from "@/components/mode-toggle";

const Index = () => {
  return (
    <AppLayout className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent dark:from-primary/10 dark:to-background" />
        
        <div className="absolute h-40 w-40 bg-secondary/20 rounded-full blur-3xl -top-20 -right-20" />
        <div className="absolute h-60 w-60 bg-primary/20 rounded-full blur-3xl -bottom-32 -left-32" />
        
        <div className="container px-4 mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 mb-6 backdrop-blur-sm animate-fade-in">
              <span className="text-sm font-medium text-primary">Intelligent Legal Document Analysis</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in [animation-delay:200ms]">
              <span className="text-gradient">Analyze Legal Documents</span> with AI-Powered Precision
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in [animation-delay:400ms]">
              Upload your contracts and legal documents to get instant clause identification, risk assessment, and plain-language summaries.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:600ms]">
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary-gradient hover:bg-primary-gradient-hover min-w-[180px] gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Choose theme</span>
          <ModeToggle />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 bg-muted/30 dark:bg-muted/5 border-y border-border">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful AI Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our advanced technology helps you understand complex legal documents
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ListChecks className="h-6 w-6" />}
              title="Clause Identification"
              description="Automatically identify and categorize important clauses in your contracts."
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6" />}
              title="Risk Assessment"
              description="Get color-coded risk scores for problematic terms and conditions."
            />
            <FeatureCard 
              icon={<FileText className="h-6 w-6" />}
              title="Key Information Extraction"
              description="Extract parties, dates, and monetary values from legal documents."
            />
            <FeatureCard 
              icon={<Brain className="h-6 w-6" />}
              title="Plain-Language Summaries"
              description="Translate complex legal terminology into easy-to-understand language."
            />
            <FeatureCard 
              icon={<FileText className="h-6 w-6" />}
              title="Document Comparison"
              description="Compare multiple versions of contracts to identify changes."
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6" />}
              title="Compliance Checking"
              description="Verify documents against jurisdiction-specific legal requirements."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="relative overflow-hidden glass-card rounded-2xl p-8 md:p-12">
            <div className="absolute inset-0 bg-primary-gradient opacity-10" />
            <div className="absolute inset-0 backdrop-blur-sm" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold mb-4">Ready to analyze your legal documents?</h2>
                <p className="text-lg text-muted-foreground">
                  Get started today and experience the power of AI-driven legal document analysis.
                </p>
              </div>
              
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary-gradient hover:bg-primary-gradient-hover min-w-[180px] gap-2">
                  Try It Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary-gradient flex items-center justify-center text-white font-semibold">
                C
              </div>
              <span className="font-medium text-lg">Clauze</span>
            </div>
            
            <div className="flex items-center gap-8">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Clauze. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </AppLayout>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="glass-card glass-card-hover p-6 rounded-xl">
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default Index;

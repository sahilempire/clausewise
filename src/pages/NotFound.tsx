
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <AppLayout>
      <div className="container flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-float">
          <FileQuestion className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-5xl font-bold mb-4 text-gradient">404</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-md">
          The document you're looking for can't be found or may have been moved.
        </p>
        <Link to="/">
          <Button className="bg-primary-gradient hover:bg-primary-gradient-hover">
            Return to Home
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
};

export default NotFound;

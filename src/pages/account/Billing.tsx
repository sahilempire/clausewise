import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Billing = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // TODO: Implement Stripe checkout
      toast({
        title: "Coming Soon",
        description: "Subscription management will be available soon.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to process upgrade request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-2xl mx-auto px-4 space-y-8">
        <h1 className="text-2xl font-bold">Billing & Subscription</h1>

        {/* Current Plan */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Free Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Basic features for individual users
                </p>
              </div>
              <Badge variant="secondary">Current Plan</Badge>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Plan Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Up to 5 document analyses per month
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Basic document templates
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Email support
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Upgrade Options */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Upgrade Options</h2>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Pro Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced features for professionals
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">$29/month</div>
                  <div className="text-sm text-muted-foreground">or $290/year</div>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Unlimited document analyses
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Advanced document templates
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Priority support
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Team collaboration features
                </li>
              </ul>
              <Button 
                onClick={handleUpgrade} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Upgrade to Pro"
                )}
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enterprise Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    Custom solutions for organizations
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium">Custom pricing</div>
                  <div className="text-sm text-muted-foreground">Contact sales</div>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Everything in Pro
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Custom integrations
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Dedicated support
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Advanced security features
                </li>
              </ul>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = 'mailto:sales@lawbit.com'}
                className="w-full"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </Card>

        {/* Billing History */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Billing History</h2>
          <div className="text-sm text-muted-foreground">
            No billing history available. Upgrade to a paid plan to see your billing history here.
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Billing; 
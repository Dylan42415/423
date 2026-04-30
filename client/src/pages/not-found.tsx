import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex w-full items-center justify-center min-h-[60vh] bg-background">
      <div className="flex flex-col items-center justify-center text-center p-8 bg-card rounded-2xl border border-card-border max-w-md w-full shadow-lg">
        <AlertCircle className="h-16 w-16 text-destructive mb-6" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          The intelligence module or data path you are looking for does not
          exist or has been moved.
        </p>
        <Link href="/">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

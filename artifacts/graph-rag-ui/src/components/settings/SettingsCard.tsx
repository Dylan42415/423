import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SettingsCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function SettingsCard({ title, description, children }: SettingsCardProps) {
  return (
    <Card className="bg-card border-card-border shadow-sm">
      <CardHeader className="pb-3 pt-5 px-6">
        <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-5">
        {children}
      </CardContent>
    </Card>
  );
}

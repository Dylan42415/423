import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface UploadCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  acceptedTypes?: string;
}

export default function UploadCard({
  icon,
  title,
  description,
  acceptedTypes,
}: UploadCardProps) {
  return (
    <Card className="bg-card border-card-border hover:border-primary/50 transition-all duration-200 cursor-pointer rounded-2xl group hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]">
      <CardHeader className="pb-2">
        <div className="h-10 w-10 rounded-lg bg-secondary text-primary flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {icon}
        </div>
        <CardTitle className="text-base text-foreground font-semibold">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {acceptedTypes && (
          <p className="text-xs text-muted-foreground/70">{acceptedTypes}</p>
        )}
      </CardContent>
    </Card>
  );
}

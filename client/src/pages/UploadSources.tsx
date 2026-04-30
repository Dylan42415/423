import {
  FileText,
  Table,
  Image as ImageIcon,
  Video,
  Mic,
  Activity,
  Map,
  GitBranch,
  UploadCloud,
  Loader2,
} from "lucide-react";
import UploadCard from "@/components/UploadCard";
import { uploadTypeConfigs } from "@/constants/uploadTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, type ReactNode } from "react";
import { api } from "@/services/api";

const iconMap: Record<string, ReactNode> = {
  FileText: <FileText />,
  Table: <Table />,
  Image: <ImageIcon />,
  Video: <Video />,
  Mic: <Mic />,
  Activity: <Activity />,
  Map: <Map />,
  GitBranch: <GitBranch />,
};

interface UploadJob {
  id: string;
  fileName: string;
  fileType: string;
  size: string;
  uploadTimestamp: string;
  status: "Pending" | "Processing" | "Completed" | "Failed";
  error?: string;
}

export default function UploadSources() {
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getSourceType = (fileType: string): string => {
    if (fileType.startsWith("image/")) return "image";
    if (fileType.startsWith("audio/")) return "audio";
    if (fileType.startsWith("video/")) return "video";
    return "text";
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newJobs: UploadJob[] = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      fileName: file.name,
      fileType: file.type || "unknown",
      size: formatSize(file.size),
      uploadTimestamp: new Date().toISOString().split("T")[1].split(".")[0],
      status: "Pending",
    }));

    setJobs((prev) => [...newJobs, ...prev]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const jobId = newJobs[i].id;
      const sourceType = getSourceType(file.type);

      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, status: "Processing" } : job))
      );

      try {
        await api.ingestFile(file, sourceType);
        setJobs((prev) =>
          prev.map((job) => (job.id === jobId ? { ...job, status: "Completed" } : job))
        );
      } catch (err: any) {
        setJobs((prev) =>
          prev.map((job) => (job.id === jobId ? { ...job, status: "Failed", error: err.message } : job))
        );
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Upload & Sources
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingest multimodal data into the processing pipeline.
        </p>
      </div>

      {/* Drag Drop Zone */}
      <input
        type="file"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      <div 
        onClick={handleBoxClick}
        className="border-2 border-dashed border-border hover:border-primary/50 bg-card/50 hover:bg-card/80 transition-all rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer group"
      >
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Drag & drop files here or click to browse
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Supports multi-gigabyte uploads. Files will be automatically routed to
          the appropriate parsing pipeline based on type.
        </p>
      </div>

      {/* Data Types Grid */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4">
          Supported Data Sources
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {uploadTypeConfigs.map((type) => (
            <UploadCard
              key={type.title}
              icon={iconMap[type.iconName] ?? <FileText />}
              title={type.title}
              description={type.desc}
            />
          ))}
        </div>
      </div>

      {/* Upload Queue */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4">
          Upload Queue
        </h3>
        <Card className="bg-card border-card-border overflow-hidden rounded-2xl shadow-sm">
          <CardContent className="p-0">
            {jobs.length === 0 ? (
              <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
                No files uploaded yet.
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase sticky top-0 backdrop-blur z-10">
                    <tr>
                      <th className="px-6 py-4 font-semibold tracking-wider">
                        File Name
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-4 font-semibold tracking-wider text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {jobs.map((file) => (
                      <tr
                        key={file.id}
                        className="hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">
                              {file.fileName}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[9px] bg-background ml-2 max-w-[150px] truncate"
                              title={file.error || file.fileType}
                            >
                              {file.error ? "Error" : file.fileType}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {file.size}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {file.uploadTimestamp}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] uppercase font-semibold border-none inline-flex items-center gap-1.5",
                              file.status === "Completed"
                                ? "bg-green-500/10 text-green-500"
                                : file.status === "Processing"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : file.status === "Failed"
                                    ? "bg-destructive/10 text-destructive"
                                    : "bg-blue-500/10 text-blue-500",
                            )}
                          >
                            {file.status === "Processing" ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <span
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  file.status === "Completed"
                                    ? "bg-green-500"
                                    : file.status === "Failed"
                                      ? "bg-destructive"
                                      : "bg-blue-500",
                                )}
                              />
                            )}
                            {file.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { FileText, Table, Image as ImageIcon, Video, Mic, Activity, Map, GitBranch, UploadCloud } from "lucide-react";
import UploadCard from "@/components/UploadCard";
import { uploadedFiles } from "@/mock/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function UploadSources() {
  const uploadTypes = [
    { icon: <FileText />, title: "Documents", desc: "PDF, DOCX, TXT files", types: "application/pdf, text/plain" },
    { icon: <Table />, title: "CSV / JSON / XML", desc: "Structured data files", types: "text/csv, application/json" },
    { icon: <ImageIcon />, title: "Images", desc: "PNG, JPG, SVG, TIFF", types: "image/*" },
    { icon: <Video />, title: "Video", desc: "MP4, MOV, AVI files", types: "video/*" },
    { icon: <Mic />, title: "Audio", desc: "MP3, WAV, FLAC files", types: "audio/*" },
    { icon: <Activity />, title: "Sensor Data", desc: "IoT and telemetry data", types: "application/octet-stream" },
    { icon: <Map />, title: "Geospatial", desc: "GeoJSON, KML, Shapefiles", types: "application/geo+json" },
    { icon: <GitBranch />, title: "Graph Files", desc: "GraphML, Cypher exports", types: "application/xml" },
  ];

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Upload & Sources</h1>
        <p className="text-sm text-muted-foreground">Ingest multimodal data into the processing pipeline.</p>
      </div>

      {/* Drag Drop Zone */}
      <div className="border-2 border-dashed border-border hover:border-primary/50 bg-card/50 hover:bg-card/80 transition-all rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer group">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Drag & drop files here or click to browse</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Supports multi-gigabyte uploads. Files will be automatically routed to the appropriate parsing pipeline based on type.
        </p>
      </div>

      {/* Data Types Grid */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4">Supported Data Sources</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {uploadTypes.map((type, idx) => (
            <UploadCard 
              key={idx}
              icon={type.icon}
              title={type.title}
              description={type.desc}
            />
          ))}
        </div>
      </div>

      {/* Upload Queue */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-4">Upload Queue</h3>
        <Card className="bg-card border-card-border overflow-hidden rounded-2xl shadow-sm">
          <CardContent className="p-0">
             <ScrollArea className="h-[400px]">
               <table className="w-full text-sm text-left">
                 <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase sticky top-0 backdrop-blur z-10">
                   <tr>
                     <th className="px-6 py-4 font-semibold tracking-wider">File Name</th>
                     <th className="px-6 py-4 font-semibold tracking-wider">Size</th>
                     <th className="px-6 py-4 font-semibold tracking-wider">Timestamp</th>
                     <th className="px-6 py-4 font-semibold tracking-wider text-right">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border">
                   {uploadedFiles.map((file) => (
                     <tr key={file.id} className="hover:bg-secondary/30 transition-colors">
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <FileText className="h-4 w-4 text-muted-foreground" />
                           <span className="font-medium text-foreground">{file.fileName}</span>
                           <Badge variant="outline" className="text-[9px] bg-background ml-2">{file.fileType}</Badge>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-muted-foreground">{file.size}</td>
                       <td className="px-6 py-4 text-muted-foreground">{file.uploadTimestamp}</td>
                       <td className="px-6 py-4 text-right">
                          <Badge variant="outline" className={cn(
                            "text-[10px] uppercase font-semibold border-none",
                            file.status === 'Completed' ? "bg-green-500/10 text-green-500" :
                            file.status === 'Processing' ? "bg-amber-500/10 text-amber-500 animate-pulse" :
                            file.status === 'Failed' ? "bg-destructive/10 text-destructive" :
                            "bg-blue-500/10 text-blue-500"
                          )}>
                            <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", 
                              file.status === 'Completed' ? "bg-green-500" :
                              file.status === 'Processing' ? "bg-amber-500" :
                              file.status === 'Failed' ? "bg-destructive" :
                              "bg-blue-500"
                            )}></span>
                            {file.status}
                          </Badge>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

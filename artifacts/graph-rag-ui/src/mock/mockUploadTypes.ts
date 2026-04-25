export interface UploadTypeConfig {
  iconName: string;
  title: string;
  desc: string;
  accept: string;
}

export const uploadTypeConfigs: UploadTypeConfig[] = [
  { iconName: 'FileText',  title: 'Documents',        desc: 'PDF, DOCX, TXT files',      accept: 'application/pdf, text/plain' },
  { iconName: 'Table',     title: 'CSV / JSON / XML',  desc: 'Structured data files',      accept: 'text/csv, application/json' },
  { iconName: 'Image',     title: 'Images',            desc: 'PNG, JPG, SVG, TIFF',        accept: 'image/*' },
  { iconName: 'Video',     title: 'Video',             desc: 'MP4, MOV, AVI files',        accept: 'video/*' },
  { iconName: 'Mic',       title: 'Audio',             desc: 'MP3, WAV, FLAC files',       accept: 'audio/*' },
  { iconName: 'Activity',  title: 'Sensor Data',       desc: 'IoT and telemetry data',     accept: 'application/octet-stream' },
  { iconName: 'Map',       title: 'Geospatial',        desc: 'GeoJSON, KML, Shapefiles',   accept: 'application/geo+json' },
  { iconName: 'GitBranch', title: 'Graph Files',       desc: 'GraphML, Cypher exports',    accept: 'application/xml' },
];

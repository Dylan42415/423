import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, RotateCcw } from "lucide-react";
import SettingsTabs from "@/components/settings/SettingsTabs";
import SettingsCard from "@/components/settings/SettingsCard";
import ToggleSwitch from "@/components/settings/ToggleSwitch";
import SliderControl from "@/components/settings/SliderControl";
import DropdownField from "@/components/settings/DropdownField";

const TABS = [
  { id: "general", label: "General" },
  { id: "ai-query", label: "AI & Query" },
  { id: "pipeline", label: "Data Pipeline" },
  { id: "graph", label: "Graph Explorer" },
  { id: "notifications", label: "Notifications" },
  { id: "appearance", label: "Appearance" },
];

const FILE_TYPE_TAGS = [
  "PDF",
  "DOCX",
  "TXT",
  "CSV",
  "JSON",
  "XML",
  "PNG",
  "JPG",
  "MP4",
  "MP3",
  "GeoJSON",
  "GraphML",
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  // General
  const [workspaceName, setWorkspaceName] = useState(
    "Environmental Intelligence Hub",
  );
  const [projectDesc, setProjectDesc] = useState(
    "Multimodal intelligence platform for graph-based analysis and insight generation.",
  );
  const [timezone, setTimezone] = useState("sg");
  const [language, setLanguage] = useState("en");
  const [landingPage, setLandingPage] = useState("/");

  // AI & Query
  const [queryMode, setQueryMode] = useState<"nl" | "cypher">("nl");
  const [answerDetail, setAnswerDetail] = useState("detailed");
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [showTrace, setShowTrace] = useState(true);
  const [autoViz, setAutoViz] = useState(true);

  // Data Pipeline
  const [maxUploadMB, setMaxUploadMB] = useState("500");
  const [autoCategorize, setAutoCategorize] = useState(true);
  const [duplicateDetect, setDuplicateDetect] = useState(true);
  const [autoGraphMerge, setAutoGraphMerge] = useState(false);
  const [failedRetry, setFailedRetry] = useState(true);

  // Graph Explorer
  const [graphLayout, setGraphLayout] = useState("force");
  const [showNodeLabels, setShowNodeLabels] = useState(true);
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);
  const [edgeAnimation, setEdgeAnimation] = useState(true);
  const [defaultZoom, setDefaultZoom] = useState(75);
  const [refreshInterval, setRefreshInterval] = useState("30s");

  // Notifications
  const [notifProcessing, setNotifProcessing] = useState(true);
  const [notifFailed, setNotifFailed] = useState(true);
  const [notifAnomaly, setNotifAnomaly] = useState(true);
  const [notifInfographic, setNotifInfographic] = useState(false);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifInApp, setNotifInApp] = useState(true);

  // Appearance
  const [darkMode, setDarkMode] = useState(true);
  const [compactLayout, setCompactLayout] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [accentColor, setAccentColor] = useState("#3b82f6");

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="px-8 pt-8 pb-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your workspace preferences and system controls.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            data-testid="button-settings-reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            data-testid="button-settings-save"
          >
            <Save className="h-3.5 w-3.5" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 mt-6">
        <SettingsTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
        {/* ── GENERAL ── */}
        {activeTab === "general" && (
          <>
            <SettingsCard
              title="Workspace Settings"
              description="Basic configuration for your intelligence workspace."
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Workspace Name
                </label>
                <Input
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="bg-background border-border"
                  data-testid="input-workspace-name"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Project Description
                </label>
                <Textarea
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  rows={3}
                  className="bg-background border-border resize-none"
                  data-testid="input-project-description"
                />
              </div>
              <DropdownField
                label="Timezone"
                value={timezone}
                onChange={setTimezone}
                data-testid="dropdown-timezone"
                options={[
                  { value: "sg", label: "Singapore (GMT+8)" },
                  { value: "utc", label: "UTC (GMT+0)" },
                  { value: "us-east", label: "US Eastern (GMT-5)" },
                  { value: "us-west", label: "US Pacific (GMT-8)" },
                  { value: "eu-london", label: "London (GMT+1)" },
                  { value: "eu-paris", label: "Paris (GMT+2)" },
                ]}
              />
              <DropdownField
                label="Language"
                value={language}
                onChange={setLanguage}
                data-testid="dropdown-language"
                options={[
                  { value: "en", label: "English" },
                  { value: "zh", label: "Chinese (Simplified)" },
                  { value: "ms", label: "Malay" },
                  { value: "ta", label: "Tamil" },
                ]}
              />
              <DropdownField
                label="Default Landing Page"
                description="The page shown when you open the workspace."
                value={landingPage}
                onChange={setLandingPage}
                data-testid="dropdown-landing-page"
                options={[
                  { value: "/", label: "Dashboard" },
                  { value: "/query", label: "Query Workspace" },
                  { value: "/graph", label: "Graph Explorer" },
                  { value: "/insights", label: "Insights" },
                ]}
              />
            </SettingsCard>
          </>
        )}

        {/* ── AI & QUERY ── */}
        {activeTab === "ai-query" && (
          <>
            <SettingsCard
              title="Query Preferences"
              description="Control how AI queries are processed and presented."
            >
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Default Query Mode
                </p>
                <p className="text-xs text-muted-foreground">
                  Choose between natural language or direct Cypher queries.
                </p>
                <div className="flex rounded-lg border border-border overflow-hidden w-fit mt-2">
                  <button
                    onClick={() => setQueryMode("nl")}
                    data-testid="button-query-mode-nl"
                    className={`px-5 py-2 text-sm font-medium transition-colors ${queryMode === "nl" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                  >
                    Natural Language
                  </button>
                  <button
                    onClick={() => setQueryMode("cypher")}
                    data-testid="button-query-mode-cypher"
                    className={`px-5 py-2 text-sm font-medium transition-colors ${queryMode === "cypher" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                  >
                    Cypher
                  </button>
                </div>
              </div>

              <DropdownField
                label="Answer Detail Level"
                description="How verbose AI responses should be."
                value={answerDetail}
                onChange={setAnswerDetail}
                data-testid="dropdown-answer-detail"
                options={[
                  { value: "concise", label: "Concise" },
                  { value: "detailed", label: "Detailed" },
                  { value: "executive", label: "Executive Summary" },
                ]}
              />

              <SliderControl
                label="Confidence Threshold"
                description="Minimum confidence score for responses to be shown."
                value={confidenceThreshold}
                min={0}
                max={100}
                step={5}
                unit="%"
                onChange={setConfidenceThreshold}
                data-testid="slider-confidence-threshold"
              />

              <ToggleSwitch
                label="Show Explanation Trace"
                description="Display the reasoning path used to reach an answer."
                checked={showTrace}
                onChange={setShowTrace}
                data-testid="toggle-show-trace"
              />
              <ToggleSwitch
                label="Auto Visualization Suggestion"
                description="Automatically suggest relevant graph views for query results."
                checked={autoViz}
                onChange={setAutoViz}
                data-testid="toggle-auto-viz"
              />
            </SettingsCard>
          </>
        )}

        {/* ── DATA PIPELINE ── */}
        {activeTab === "pipeline" && (
          <>
            <SettingsCard
              title="Ingestion Controls"
              description="Configure file processing and pipeline behavior."
            >
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Max Upload Size (MB)
                </label>
                <p className="text-xs text-muted-foreground">
                  Maximum file size allowed per upload.
                </p>
                <Input
                  type="number"
                  value={maxUploadMB}
                  onChange={(e) => setMaxUploadMB(e.target.value)}
                  className="bg-background border-border w-40"
                  data-testid="input-max-upload-size"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Supported File Types
                </p>
                <p className="text-xs text-muted-foreground">
                  File types accepted by the ingestion pipeline.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {FILE_TYPE_TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-mono"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <ToggleSwitch
                label="Auto Categorization"
                description="Automatically assign uploaded files to data collections."
                checked={autoCategorize}
                onChange={setAutoCategorize}
                data-testid="toggle-auto-categorize"
              />
              <ToggleSwitch
                label="Duplicate File Detection"
                description="Flag and prevent duplicate uploads based on content hash."
                checked={duplicateDetect}
                onChange={setDuplicateDetect}
                data-testid="toggle-duplicate-detect"
              />
              <ToggleSwitch
                label="Auto Graph Merge"
                description="Automatically merge extracted entities into the knowledge graph after processing."
                checked={autoGraphMerge}
                onChange={setAutoGraphMerge}
                data-testid="toggle-auto-graph-merge"
              />
              <ToggleSwitch
                label="Failed Upload Retry"
                description="Automatically retry failed uploads up to 3 times."
                checked={failedRetry}
                onChange={setFailedRetry}
                data-testid="toggle-failed-retry"
              />
            </SettingsCard>
          </>
        )}

        {/* ── GRAPH EXPLORER ── */}
        {activeTab === "graph" && (
          <>
            <SettingsCard
              title="Graph Visualization Settings"
              description="Configure how the knowledge graph is rendered and interacted with."
            >
              <DropdownField
                label="Graph Layout Algorithm"
                description="Determines how nodes are positioned in the graph canvas."
                value={graphLayout}
                onChange={setGraphLayout}
                data-testid="dropdown-graph-layout"
                options={[
                  { value: "force", label: "Force Directed" },
                  { value: "hierarchical", label: "Hierarchical" },
                  { value: "circular", label: "Circular" },
                  { value: "grid", label: "Grid" },
                ]}
              />
              <ToggleSwitch
                label="Show Node Labels"
                description="Display entity names on graph nodes."
                checked={showNodeLabels}
                onChange={setShowNodeLabels}
                data-testid="toggle-show-node-labels"
              />
              <ToggleSwitch
                label="Show Relationship Labels"
                description="Display relationship type text on graph edges."
                checked={showEdgeLabels}
                onChange={setShowEdgeLabels}
                data-testid="toggle-show-edge-labels"
              />
              <ToggleSwitch
                label="Edge Animation"
                description="Animate directional flow along relationship edges."
                checked={edgeAnimation}
                onChange={setEdgeAnimation}
                data-testid="toggle-edge-animation"
              />
              <SliderControl
                label="Default Zoom Level"
                description="Initial zoom percentage when the graph canvas loads."
                value={defaultZoom}
                min={25}
                max={150}
                step={5}
                unit="%"
                onChange={setDefaultZoom}
                data-testid="slider-default-zoom"
              />
              <DropdownField
                label="Graph Refresh Interval"
                description="How often the graph re-fetches data from the backend."
                value={refreshInterval}
                onChange={setRefreshInterval}
                data-testid="dropdown-refresh-interval"
                options={[
                  { value: "off", label: "Off (manual only)" },
                  { value: "15s", label: "Every 15 seconds" },
                  { value: "30s", label: "Every 30 seconds" },
                  { value: "1m", label: "Every minute" },
                  { value: "5m", label: "Every 5 minutes" },
                ]}
              />
            </SettingsCard>
          </>
        )}

        {/* ── NOTIFICATIONS ── */}
        {activeTab === "notifications" && (
          <>
            <SettingsCard
              title="Alert Types"
              description="Choose which events trigger notifications."
            >
              <ToggleSwitch
                label="Processing Completed"
                description="Notify when a file finishes moving through the pipeline."
                checked={notifProcessing}
                onChange={setNotifProcessing}
                data-testid="toggle-notif-processing"
              />
              <ToggleSwitch
                label="Failed Upload Alerts"
                description="Notify when a file upload or processing step fails."
                checked={notifFailed}
                onChange={setNotifFailed}
                data-testid="toggle-notif-failed"
              />
              <ToggleSwitch
                label="Anomaly Detection Alerts"
                description="Notify when the system detects unusual patterns in the graph."
                checked={notifAnomaly}
                onChange={setNotifAnomaly}
                data-testid="toggle-notif-anomaly"
              />
              <ToggleSwitch
                label="Infographic Ready"
                description="Notify when a generated insight report is ready to view."
                checked={notifInfographic}
                onChange={setNotifInfographic}
                data-testid="toggle-notif-infographic"
              />
            </SettingsCard>

            <SettingsCard
              title="Delivery Channels"
              description="Where notifications are sent."
            >
              <ToggleSwitch
                label="Email Notifications"
                description="Send alerts to the workspace owner's email address."
                checked={notifEmail}
                onChange={setNotifEmail}
                data-testid="toggle-notif-email"
              />
              <ToggleSwitch
                label="In-App Notifications"
                description="Show alerts in the notification bell within the platform."
                checked={notifInApp}
                onChange={setNotifInApp}
                data-testid="toggle-notif-inapp"
              />
            </SettingsCard>
          </>
        )}

        {/* ── APPEARANCE ── */}
        {activeTab === "appearance" && (
          <>
            <SettingsCard
              title="Display Preferences"
              description="Customize the look and feel of the platform."
            >
              <ToggleSwitch
                label="Dark Mode"
                description="Use the dark color scheme across the platform."
                checked={darkMode}
                onChange={setDarkMode}
                data-testid="toggle-dark-mode"
              />
              <ToggleSwitch
                label="Compact Layout"
                description="Reduce padding and spacing for a denser information display."
                checked={compactLayout}
                onChange={setCompactLayout}
                data-testid="toggle-compact-layout"
              />
              <ToggleSwitch
                label="Sidebar Collapsed by Default"
                description="Start with the sidebar in icon-only mode on load."
                checked={sidebarCollapsed}
                onChange={setSidebarCollapsed}
                data-testid="toggle-sidebar-collapsed"
              />
              <ToggleSwitch
                label="UI Animations"
                description="Enable transitions and motion effects throughout the interface."
                checked={animations}
                onChange={setAnimations}
                data-testid="toggle-animations"
              />

              <div className="space-y-2 pt-1">
                <p className="text-sm font-medium text-foreground">
                  Accent Color
                </p>
                <p className="text-xs text-muted-foreground">
                  Primary highlight color used for active states and interactive
                  elements.
                </p>
                <div className="flex items-center gap-3 mt-2">
                  {[
                    "#3b82f6",
                    "#6366f1",
                    "#8b5cf6",
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      data-testid={`button-accent-${color.replace("#", "")}`}
                      className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${accentColor === color ? "ring-2 ring-offset-2 ring-offset-background ring-white scale-110" : ""}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-7 w-7 rounded-full cursor-pointer border-0 bg-transparent"
                    title="Custom color"
                    data-testid="input-accent-color-custom"
                  />
                </div>
              </div>
            </SettingsCard>
          </>
        )}
      </div>
    </div>
  );
}

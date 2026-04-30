import { z } from "zod";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  // Server Config
  PORT: z.coerce.number().default(8080),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // LLM Config
  LLM_PROVIDER: z.enum(["groq", "ollama", "openai"]).default("groq"),
  GROQ_API_KEY: z.string().optional(),
  LLM_MODEL: z.string().default("llama-3.3-70b-versatile"),
  LLM_FALLBACK_PROVIDER: z.enum(["groq", "ollama", "openai"]).default("ollama"),
  OLLAMA_URL: z.string().default("http://localhost:11434"),

  // Embedding + Vector Search
  EMBEDDING_MODEL: z.string().default("all-MiniLM-L6-v2"),
  VECTOR_DB_TYPE: z.enum(["faiss", "neo4j_vector"]).default("neo4j_vector"),

  // Multimodal Settings
  WHISPER_MODEL: z.string().default("whisper-large-v3"),
  OCR_ENGINE: z.string().default("meta-llama/llama-4-scout-17b-16e-instruct"),
  VIDEO_FRAME_RATE: z.coerce.number().default(1),

  // File System Config
  UPLOAD_DIR: z.string().default("./uploads"),
  MAX_FILE_SIZE_MB: z.coerce.number().default(50),

  // Graph-RAG Behavior Controls
  GRAPH_MAX_DEPTH: z.coerce.number().default(3),
  CONFIDENCE_THRESHOLD: z.coerce.number().default(0.1),
  ENABLE_MULTI_HOP: z.coerce.boolean().default(true),

  // Performance Settings
  MAX_CONCURRENT_INGESTION: z.coerce.number().default(5),
  LLM_TOKEN_LIMIT: z.coerce.number().default(4096),

  // Logging System
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  LOG_INGESTION: z.coerce.boolean().default(true),
  LOG_QUERIES: z.coerce.boolean().default(true),

  // Security Settings
  API_RATE_LIMIT: z.coerce.number().default(100),
  AUTH_ENABLED: z.coerce.boolean().default(false),

  // Neo4j Graph Database
  NEO4J_URI: z.string().default("bolt://localhost:7687"),
  NEO4J_USERNAME: z.string().default("neo4j"),
  NEO4J_PASSWORD: z.string().default("password"),
  NEO4J_DATABASE: z.string().optional(),
});

// Parse the environment variables
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment configuration:");
  parsed.error.issues.forEach((issue) => {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  });
  process.exit(1);
}

const env = parsed.data;

// Export the typed configuration object
export const config = {
  server: {
    port: env.PORT,
    env: env.NODE_ENV,
  },
  llm: {
    provider: env.LLM_PROVIDER,
    groqApiKey: env.GROQ_API_KEY,
    model: env.LLM_MODEL,
    fallbackProvider: env.LLM_FALLBACK_PROVIDER,
    ollamaUrl: env.OLLAMA_URL,
  },
  vector: {
    embeddingModel: env.EMBEDDING_MODEL,
    dbType: env.VECTOR_DB_TYPE,
  },
  multimodal: {
    whisperModel: env.WHISPER_MODEL,
    ocrEngine: env.OCR_ENGINE,
    videoFrameRate: env.VIDEO_FRAME_RATE,
  },
  fs: {
    uploadDir: env.UPLOAD_DIR,
    maxFileSizeMb: env.MAX_FILE_SIZE_MB,
  },
  graphRag: {
    maxDepth: env.GRAPH_MAX_DEPTH,
    confidenceThreshold: env.CONFIDENCE_THRESHOLD,
    enableMultiHop: env.ENABLE_MULTI_HOP,
  },
  performance: {
    maxConcurrentIngestion: env.MAX_CONCURRENT_INGESTION,
    tokenLimit: env.LLM_TOKEN_LIMIT,
  },
  logging: {
    level: env.LOG_LEVEL,
    logIngestion: env.LOG_INGESTION,
    logQueries: env.LOG_QUERIES,
  },
  security: {
    apiRateLimit: env.API_RATE_LIMIT,
    authEnabled: env.AUTH_ENABLED,
  },
  neo4j: {
    uri: env.NEO4J_URI,
    username: env.NEO4J_USERNAME,
    password: env.NEO4J_PASSWORD,
    database: env.NEO4J_DATABASE,
  },
};

/**
 * Logs the active configuration, masking sensitive values.
 */
export function logActiveConfig(logger: { info: (obj: any, msg: string) => void }) {
  const maskedConfig = JSON.parse(JSON.stringify(config));

  // Mask secrets
  if (maskedConfig.llm.groqApiKey) {
    maskedConfig.llm.groqApiKey = "***";
  }
  if (maskedConfig.neo4j.password) {
    maskedConfig.neo4j.password = "***";
  }

  logger.info({ config: maskedConfig }, "Loaded environment configuration");
}

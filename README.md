# Visual-Insight-Finder

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue.svg?logo=github)](https://github.com/Dylan42415/423)

## Quick Setup

Welcome to the Visual-Insight-Finder repository! Follow these simple steps to get the application running locally.

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **pnpm** (install via `npm install -g pnpm` if you don't have it)
- A local or cloud **Neo4j** database

### 1. Clone the Repository
Open your terminal and clone the repository:
```bash
git clone https://github.com/Dylan42415/423.git
cd 423
```

### 2. Install Dependencies
Run the following command in the root directory to install all dependencies for both the client and the server:
```bash
pnpm install
```

### 2. Run Initial Setup
This command will automatically create your environment files (`.env`) for both the client and the server:
```bash
pnpm run setup
```

### 3. Configure API Keys
Open `server/.env` and provide the following required credentials:

#### 🧠 LLM (Groq)
- `GROQ_API_KEY`: Get your key from the [Groq Console](https://console.groq.com/keys).
- *Optional*: If you prefer local LLMs, you can use [Ollama](https://ollama.com/) by setting `LLM_PROVIDER=ollama` and ensuring Ollama is running.

#### 🧩 Database (Neo4j)
- `NEO4J_URI`: The connection URI (e.g., `neo4j+s://your-db.databases.neo4j.io`).
- `NEO4J_USERNAME`: Usually `neo4j`.
- `NEO4J_PASSWORD`: Your database password.
- *Tip*: You can get a free instance at [Neo4j Aura](https://neo4j.com/cloud/aura/).

### 4. Start the Application
To start both the frontend and backend development servers concurrently, run:
```bash
pnpm run dev
```

- **Client**: [http://localhost:5173](http://localhost:5173)
- **Server**: [http://localhost:8080](http://localhost:8080)

---

## 🛠️ Troubleshooting

- **Neo4j Connection Error**: Ensure your IP is whitelisted in Neo4j Aura and that the `NEO4J_URI` uses the correct protocol (`neo4j+s://` for Aura).
- **Port 8080 in use**: You can change the server port in `server/.env` by updating `PORT=8080` and then updating `VITE_API_BASE_URL` in `client/.env` to match.
- **Missing Dependencies**: If you encounter "module not found" errors, try running `pnpm install` again to ensure all workspace dependencies are linked.

---

## Workspace Structure
- `/client` - React frontend powered by Vite and Tailwind CSS.
- `/server` - Node.js backend handling API requests and graph processing.

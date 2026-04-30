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
This command will automatically create a `.env` file for your server using the provided `.env.example` template:
```bash
pnpm run setup
```

### 3. Configure Environment Variables
Open the newly created `server/.env` file and add your required API keys and configuration, such as:
- `GROQ_API_KEY`
- `NEO4J_URI`, `NEO4J_USERNAME`, and `NEO4J_PASSWORD`

### 4. Start the Application
To start both the frontend and backend development servers concurrently, run:
```bash
pnpm run dev
```

- **Client**: Typically runs at `http://localhost:5173`
- **Server**: Typically runs at `http://localhost:8080` (as defined in `.env`)

---

## Workspace Structure
- `/client` - React frontend powered by Vite and Tailwind CSS.
- `/server` - Node.js backend handling API requests and graph processing.

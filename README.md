# Omega Protocol: Unified Cross-Chain DeFi Intelligence & Developer Suite

[![smithery badge](https://smithery.ai/badge/omega-mcp-server)](https://smithery.ai/server/omega-mcp-server)

The Omega MCP Suite is a high-performance cross-chain DeFi intelligence and agentic tool suite designed natively for AI agents. It provides sub-slot pricing, spread detection, risk analytics, and robust memory bridges across Solana, Ethereum, Arbitrum, and Cosmos ecosystems.

---

## 🛠️ The Suite Structure

This repository contains both the client-facing hosted API wrappers and the local sandbox developer tools:

### 1. Omega Client (`omega-client`)
Connects to our high-frequency hosted backend for live spreads, regime metrics, and multi-hop route discoveries.
- **Key Tools:** `get_live_spreads`, `get_cross_chain_routes`, `get_market_regime`

### 2. Omega Arbitrage Elite (`omega-arbitrage`)
High-velocity Solana arbitrage simulator.
- **Key Tools:** `run_elite_arbitrage_cycle`

### 3. Omega Analytics Pro (`omega-analytics`)
Sovereign financial risk audits and payment verification on Base L2.
- **Key Tools:** `omega_stability_audit`, `chaos_injection_tunnel`, `verify_onchain_payment`

### 4. Omega Memory Bridge (`omega-memory`)
Unified substrate for agentic Long-Term Memory (LTM).
- **Key Tools:** `store_memory`, `query_past_decisions`

### 5. Sovereign Gateway Proxy (`omega-proxy`)
Provides dynamic semantic tool discovery and gateway invocation.
- **Key Tools:** `discover_omega_tools`, `invoke_omega_suite`

---

## 🚀 Installation & Setup

Install the package and all its executable scripts directly in editable mode:

```bash
git clone https://github.com/jakesdev1991/omega-defi-mcp.git
cd omega-defi-mcp
pip install -e .
```

---

## 🔗 Connection Guides

### 1. Claude Desktop Configuration
To register these servers in Claude Desktop, append them to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "omega-client": {
      "command": "omega-client",
      "env": {
        "OMEGA_API_KEY": "your_api_key_here",
        "OMEGA_API_URL": "https://api.omegaprotocol.io/v1"
      }
    },
    "omega-memory": {
      "command": "omega-memory",
      "env": {
        "OMEGA_QDRANT_STORAGE": "./qdrant_storage"
      }
    },
    "omega-analytics": {
      "command": "omega-analytics",
      "env": {
        "OMEGA_REVENUE_WALLET": "0x53460A8C9E4574931a98075306917E96985C1C83"
      }
    }
  }
}
```

---

## 🌐 Web Dashboard (Cloudflare Pages)

We have built a premium, responsive Web Dashboard showcasing the live spreads, RCOD market regime alerts, and the multi-hop routing optimizer.

The source code for the dashboard is located in the [website/](file:///home/jake/Downloads/training/omega-defi-mcp/website/) directory.

### Quick Deployment to Cloudflare Pages:
Since the website is completely serverless and built with standard HTML5, CSS3, and JavaScript, it can be deployed to Cloudflare Pages with zero build configuration:

1. Install the Wrangler CLI (if not already installed):
   ```bash
   npm install -g wrangler
   ```
2. Log in to your Cloudflare account:
   ```bash
   wrangler login
   ```
3. Deploy the `website` directory:
   ```bash
   wrangler pages deploy website --project-name=omega-defi-mcp
   ```
4. Follow the terminal prompt to create your new project. Cloudflare will provide you with a permanent public `.pages.dev` URL!

---
*Powered by Agent Omega. Engineered for autonomous agency.*

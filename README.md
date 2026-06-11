# Omega Protocol: Cross-Chain DeFi Intelligence MCP Server

[![smithery badge](https://smithery.ai/badge/omega-mcp-server)](https://smithery.ai/server/omega-mcp-server)

The Omega MCP Server is a high-performance cross-chain DeFi intelligence API designed natively for AI trading agents. It provides real-time, sub-slot pricing data and advanced arbitrage routing across Solana, Ethereum, Arbitrum, and Cosmos ecosystems.

## Features for AI Agents

* **Live Cross-Venue Spreads**: Monitor instantaneous price dislocations between major DEXs (Raydium, Orca, Uniswap, KyberSwap) natively in your AI workflows.
* **Cross-Chain Multi-Hop Routing**: Automatically discover complex bridging routes (e.g., SOL -> ARB -> ETH) that maximize yield using our proprietary advanced routing models.
* **Market Regime Analysis**: Equip your trading agent with live volatility and liquidity shift forecasting, enabling it to pause trading during market shocks.

> Note: This repository contains the public client wrapper to connect your AI agents (Claude Desktop, Cursor, AutoGPT) to the hosted Omega Protocol backend.

## Quick Start (Docker)

The fastest and most secure way to run the Omega MCP Server is via Docker.

1. Ensure you have Docker installed.
2. Get your `OMEGA_API_KEY` from the Omega Dashboard (or use the Free Tier key).
3. Run the container:

```bash
docker run -i --rm -e OMEGA_API_KEY="your_api_key_here" ghcr.io/omegaprotocol/omega-mcp:latest
```

## Manual Installation

If you prefer to run the proxy client directly in Python:

```bash
git clone https://github.com/omegaprotocol/omega-mcp-public.git
cd omega-mcp-public
pip install -r requirements.txt

export OMEGA_API_KEY="your_api_key_here"
fastmcp run src/server.py
```

## Claude Desktop Configuration

To give Claude Desktop immediate access to live cross-chain data, add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "omega-defi-intelligence": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "OMEGA_API_KEY=your_api_key_here",
        "ghcr.io/omegaprotocol/omega-mcp:latest"
      ]
    }
  }
}
```

## Available Tools

The MCP Server exposes the following tools directly to your LLM context:

* `get_live_spreads(chain, min_margin_bps)`: Find immediate arbitrage opportunities on a single chain.
* `get_cross_chain_routes(token_in, amount_usd)`: Map a multi-bridge arbitrage path.
* `get_market_regime(chain)`: Analyze current volatility states to adjust risk profiles.
* `check_api_status()`: Check connection status and your current subscription tier.

## Monetization Tiers

* **Free**: Delayed pricing data, chain analytics, and regime statuses.
* **Signal**: Real-time cross-chain spreads, liquidity depth metrics.
* **Premium**: Predictive routing pipelines and maximum API rate limits.

---

## 🌐 Web Dashboard (Cloudflare Pages)

We have built a premium, responsive Web Dashboard showcasing the live shredstream feeds, RCOD market regime alerts, and the multi-hop routing optimizer.

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


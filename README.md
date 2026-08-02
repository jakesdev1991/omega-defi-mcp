# Omega DeFi MCP

Model Context Protocol server for DeFi operations on Solana. Connects AI assistants (Claude, Cursor, etc.) to real-time DEX spreads, multi-bridge pathfinding, and market volatility forecasting via FastMCP.

## Features

- **Real-time DEX Spreads**: Live pricing from Jupiter, Orca, Raydium
- **Multi-bridge Pathfinding**: Optimal routes across Wormhole, Allbridge, Portal
- **Volatility Forecasting**: ML-powered price prediction models
- **FastMCP Integration**: Native MCP server for AI assistant connectivity

## Quick Start

```bash
# Install dependencies
pip install -e .

# Configure
cp .env.example .env
# Edit .env with your RPC endpoints

# Run server
python -m src.omega_defi_mcp
```

## Configuration

Required environment variables:

```bash
SOLANA_RPC_URL=https://your-rpc-endpoint
JUPITER_API_URL=https://quote-api.jup.ag/v6
WORMHOLE_RPC=https://wormhole-rpc.example.com
```

## MCP Client Configuration

Add to your MCP client config:

```json
{
  "mcpServers": {
    "omega-defi": {
      "command": "python",
      "args": ["-m", "src.omega_defi_mcp"],
      "env": {
        "SOLANA_RPC_URL": "https://..."
      }
    }
  }
}
```

## Available Tools

- `get_dex_spreads` - Current spreads across major DEXs
- `find_bridge_route` - Optimal cross-chain bridge paths
- `forecast_volatility` - Short-term volatility predictions
- `get_token_price` - Real-time token pricing

## Development

```bash
# Install dev dependencies
pip install -e .[dev]

# Run tests
pytest

# Lint
ruff check src/
mypy src/
```

## Docker

```bash
docker build -t omega-defi-mcp .
docker run -p 8000:8000 --env-file .env omega-defi-mcp
```

## License

MIT License - see [LICENSE](LICENSE) for details.
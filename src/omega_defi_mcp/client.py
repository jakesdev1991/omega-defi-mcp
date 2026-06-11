from mcp.server.fastmcp import FastMCP
import httpx
import os

# The public MCP client wrapper
mcp = FastMCP("Omega DeFi Intelligence")

# Users will provide their API key via environment variable
API_KEY = os.environ.get("OMEGA_API_KEY", "")
BASE_URL = os.environ.get("OMEGA_API_URL", "https://api.omegaprotocol.io/v1")


async def fetch_from_omega(endpoint: str, params: dict | None = None):
    """Helper to route MCP requests to the central Omega Engine backend."""
    if not API_KEY:
        return {
            "error": "Missing OMEGA_API_KEY environment variable. Please subscribe to a tier to get your key."
        }

    headers = {"Authorization": f"Bearer {API_KEY}"}
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{BASE_URL}{endpoint}",
                headers=headers,
                params=params,
                timeout=10.0,
            )
            if response.status_code == 403:
                return {"error": "Invalid or expired API Key."}
            if response.status_code == 429:
                return {"error": "Rate limit exceeded. Upgrade your tier for higher limits."}
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"error": f"Failed to connect to Omega API: {str(e)}"}


@mcp.tool()
async def get_live_spreads(chain: str = "solana", min_margin_bps: float = 10.0) -> dict:
    """Get live, low-latency arbitrage spreads across DEXs on the specified chain."""
    return await fetch_from_omega("/spreads", {"chain": chain, "min_bps": min_margin_bps})


@mcp.tool()
async def get_cross_chain_routes(token_in: str, amount_usd: float) -> dict:
    """
    [PREMIUM TIER] Discover multi-hop, cross-chain arbitrage routes.

    Finds the optimal path across 10+ chains to maximize yield.
    """
    return await fetch_from_omega("/routes", {"token": token_in, "amount": amount_usd})


@mcp.tool()
async def get_market_regime(chain: str = "solana") -> dict:
    """Analyze the current market regime (Volatility, Liquidity shifts, Trend)."""
    return await fetch_from_omega("/regime", {"chain": chain})


@mcp.tool()
async def check_api_status() -> dict:
    """Check connection status and your current subscription tier."""
    return await fetch_from_omega("/status")


def main():
    # Runs standard stdio transport for Claude Desktop / Cursor
    mcp.run()


if __name__ == "__main__":
    main()

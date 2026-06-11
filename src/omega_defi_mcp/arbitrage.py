from mcp.server.fastmcp import FastMCP
import os
from .client import fetch_from_omega

mcp = FastMCP("Omega Arbitrage Elite")

@mcp.tool()
async def run_elite_arbitrage_cycle(route_id: str = "SOL-USDC-JUP") -> dict:
    """
    Runs a single high-velocity arbitrage cycle remotely on the active Omega Engine.
    """
    return await fetch_from_omega("/run_elite_arbitrage_cycle", {"route_id": route_id})

def main():
    mcp.run()

if __name__ == "__main__":
    main()

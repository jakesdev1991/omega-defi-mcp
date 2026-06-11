from mcp.server.fastmcp import FastMCP
import os
from .client import fetch_from_omega

mcp = FastMCP("Omega Analytics")

@mcp.tool()
async def verify_onchain_payment(tx_hash: str, expected_usd: float = 0.25) -> dict:
    """
    Verifies a USDC pay-per-inquiry transaction on the Base L2 network.
    
    Args:
        tx_hash: The hash of the Base L2 transaction.
        expected_usd: Expected payment amount in USD.
    """
    return await fetch_from_omega("/verify_onchain_payment", {"tx_hash": tx_hash, "expected_usd": expected_usd})

@mcp.tool()
async def omega_stability_audit(route_id: str, current_liquidity: float) -> dict:
    """
    Performs a micro-structural state stability audit on a target route.
    """
    return await fetch_from_omega("/omega_stability_audit", {"route_id": route_id, "current_liquidity": current_liquidity})

@mcp.tool()
async def chaos_injection_tunnel(route_id: str, intensity: float = 0.5) -> dict:
    """
    Simulates a chaos injection test (mempool front-running, sudden slippage shocks).
    
    Args:
        route_id: Target corridor.
        intensity: Volatility multiplier (0.0 to 1.0).
    """
    return await fetch_from_omega("/chaos_injection_tunnel", {"route_id": route_id, "intensity": intensity})

def main():
    mcp.run()

if __name__ == "__main__":
    main()

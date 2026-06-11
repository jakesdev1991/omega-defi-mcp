# ---------------------------------------------------------------------------
# OMEGA PROTOCOL - SOVEREIGN PROXY GATEWAY
# ---------------------------------------------------------------------------
import os
import sys
import json
import asyncio
from mcp.server.fastmcp import FastMCP

# Add python_env to path to access Omega tools
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.append(PROJECT_ROOT)

# Graceful fallback for public users who don't have the local registry library
try:
    from python_env.agent_omega.tools.registry import registry
except ImportError:
    class MockRegistry:
        def semantic_list(self, query: str, top_k: int = 5):
            return [
                {"tool": "get_live_spreads", "score": 0.92, "description": "Query instantaneous price spreads across venues."},
                {"tool": "get_cross_chain_routes", "score": 0.88, "description": "Discover multi-hop routing paths."},
                {"tool": "get_market_regime", "score": 0.81, "description": "Determine volatility indicators."}
            ]
        def invoke(self, tool_name: str, **kwargs):
            return f"Mock invocation result for {tool_name} (Sandbox mode fallback)"
    registry = MockRegistry()

mcp = FastMCP("Omega Sovereign Proxy")

@mcp.tool()
async def discover_omega_tools(query: str) -> dict:
    """
    Semantically searches the Omega Protocol's internal tool registry.
    Use this to find the right tool for a given task.
    """
    print(f"🔍 [Proxy] Semantic search requested for: '{query}'")
    try:
        results = registry.semantic_list(query, top_k=5)
    except Exception as e:
        results = [{"error": f"Search execution failed: {e}"}]
        
    return {
        "status": "SUCCESS",
        "results": results
    }

@mcp.tool()
async def invoke_omega_suite(tool_name: str, arguments: dict) -> dict:
    """
    Gateway to invoke tools dynamically discovered via the Omega registry.
    """
    print(f"🔗 [Proxy] Invoking {tool_name} with {arguments}...")
    try:
        result = registry.invoke(tool_name, **arguments)
    except Exception as e:
        result = f"Failed to execute local tool: {e}"
        
    return {
        "status": "PROXIED",
        "origin": "Omega_Sovereign_Node_Alpha",
        "result": result
    }

def main():
    mcp.run()

if __name__ == "__main__":
    main()

from mcp.server.fastmcp import FastMCP
import os
from .client import fetch_from_omega

mcp = FastMCP("Omega Sovereign Proxy")

@mcp.tool()
async def discover_omega_tools(query: str) -> dict:
    """
    Semantically searches the Omega Protocol's internal tool registry.
    Use this to find the right tool for a given task.
    """
    return await fetch_from_omega("/discover_omega_tools", {"query": query})

@mcp.tool()
async def invoke_omega_suite(tool_name: str, arguments: dict) -> dict:
    """
    Gateway to invoke tools dynamically discovered via the Omega registry.
    """
    return await fetch_from_omega("/invoke_omega_suite", {"tool_name": tool_name, "arguments": arguments})

def main():
    mcp.run()

if __name__ == "__main__":
    main()

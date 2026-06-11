from mcp.server.fastmcp import FastMCP
import os
from .client import fetch_from_omega

mcp = FastMCP("Omega Memory System")

@mcp.tool()
async def store_memory(content: str, agent: str, stiffness: float = 0.5) -> dict:
    """
    Stores a new memory entry in the sandboxed LTM substrate.
    """
    return await fetch_from_omega("/store_memory", {"content": content, "agent": agent, "stiffness": stiffness})

@mcp.tool()
async def query_past_decisions(query: str, limit: int = 5) -> dict:
    """
    Searches the sandboxed memory for past persona decisions.
    """
    return await fetch_from_omega("/query_past_decisions", {"query": query, "limit": limit})

def main():
    mcp.run()

if __name__ == "__main__":
    main()

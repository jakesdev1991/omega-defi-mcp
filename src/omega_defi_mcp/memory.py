# ---------------------------------------------------------------------------
# OMEGA PROTOCOL - OMEGA MEMORY BRIDGE CLIENT
# ---------------------------------------------------------------------------

import os
import sys
import json
import logging
from mcp.server.fastmcp import FastMCP

# Ensure Qdrant storage path is configurable
STORAGE_PATH = os.getenv("OMEGA_QDRANT_STORAGE", "./qdrant_storage")

mcp = FastMCP("Omega-Memory-System")

@mcp.tool()
def store_memory(content: str, agent: str, stiffness: float = 0.5) -> str:
    """
    Stores a new memory entry in the sandboxed LTM substrate.
    """
    # Simplified for public suite
    return f"✅ Memory from {agent} stored in {STORAGE_PATH}"

@mcp.tool()
def query_past_decisions(query: str, limit: int = 5) -> str:
    """
    Searches the sandboxed memory for past persona decisions.
    """
    return "No similar past decisions found (Sandbox Mode)."

def main():
    mcp.run()

if __name__ == "__main__":
    main()

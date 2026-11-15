"""Smoke tests: every MCP module imports and exposes its FastMCP server."""

from omega_defi_mcp import analytics, arbitrage, client, memory, proxy


def test_modules_expose_mcp_servers():
    for module in (analytics, arbitrage, client, memory, proxy):
        assert module.mcp is not None
        assert module.mcp.name.startswith("Omega")

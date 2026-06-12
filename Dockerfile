FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the proxy server
COPY src/ /app/src/

# Set environment variables
ENV PYTHONUNBUFFERED=1

# The container runs the MCP server using stdio transport.
ENTRYPOINT ["python", "src/server.py"]

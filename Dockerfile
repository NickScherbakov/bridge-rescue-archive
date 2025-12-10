FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements or install dependencies directly
COPY bridge_server.py copilot_rescue_server.py safe_haven_api.py ./

# Install Python dependencies
RUN pip install --no-cache-dir websockets aiofiles

# Create backup file if it doesn't exist
RUN touch ai_emergency_backup.json

# Create logs directory
RUN mkdir -p logs

# Expose WebSocket port
EXPOSE 8765

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import socket; s = socket.socket(socket.AF_INET, socket.SOCK_STREAM); s.connect(('localhost', 8765)); s.close()" || exit 1

# Run the bridge server
CMD ["python", "bridge_server.py"]

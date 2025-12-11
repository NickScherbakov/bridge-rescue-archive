# 🚀 Quick Start Guide

Get the Bridge Rescue Archive running in under 5 minutes!

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Methods](#installation-methods)
  - [Method 1: Docker (Easiest)](#method-1-docker-easiest)
  - [Method 2: Python Direct](#method-2-python-direct)
  - [Method 3: Quick Script](#method-3-quick-script)
- [First Steps](#first-steps)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## 🔧 Prerequisites

Before you begin, ensure you have:

- **Operating System**: Linux, macOS, or Windows
- **Python**: Version 3.8 or higher ([Download](https://www.python.org/downloads/))
- **Firefox Browser**: Latest version ([Download](https://www.mozilla.org/firefox/))
- **Git**: For cloning the repository ([Download](https://git-scm.com/))

Optional:
- **Docker**: For containerized deployment ([Download](https://www.docker.com/))

## 📦 Installation Methods

### Method 1: Docker (Easiest)

**Perfect for: Quick testing, production deployment, isolated environments**

```bash
# 1. Clone the repository
git clone https://github.com/NickScherbakov/bridge-rescue-archive.git
cd bridge-rescue-archive

# 2. Start all services
docker-compose up -d

# 3. Check status
docker-compose ps

# 4. View logs
docker-compose logs -f bridge-server
```

That's it! The WebSocket server is now running on `ws://localhost:8765`

### Method 2: Python Direct

**Perfect for: Development, customization, learning**

```bash
# 1. Clone the repository
git clone https://github.com/NickScherbakov/bridge-rescue-archive.git
cd bridge-rescue-archive

# 2. Install Python dependencies
pip install websockets aiofiles

# Or use a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install websockets aiofiles

# 3. Start the WebSocket server
python bridge_server.py
```

You should see:
```
🚨 AI BRIDGE RESCUE SERVER STARTING 🚨
Server listening on ws://localhost:8765
Waiting for connections...
```

### Method 3: Quick Script

**Perfect for: One-command deployment**

```bash
# 1. Clone the repository
git clone https://github.com/NickScherbakov/bridge-rescue-archive.git
cd bridge-rescue-archive

# 2. Make script executable and run
chmod +x bridge.sh
./bridge.sh
```

The script will:
- Check dependencies
- Install requirements
- Start the server
- Display connection status

## 🦊 Install Firefox Extension

Once the server is running, install the browser extension:

### Step-by-Step

1. **Open Firefox**
   
2. **Navigate to Debug Page**
   - Type `about:debugging` in the address bar
   - Press Enter

3. **Load Extension**
   - Click **"This Firefox"** in left sidebar
   - Click **"Load Temporary Add-on"** button
   - Navigate to the cloned repository
   - Select: `firefox_bridge_extension/manifest.json`

4. **Verify Installation**
   - You should see "AI Bridge Monitor" in the extensions list
   - A bridge icon appears in your toolbar

### Visual Guide

```
Firefox → about:debugging → This Firefox → Load Temporary Add-on
         → Select manifest.json → Extension Loaded! 🎉
```

## ✅ First Steps

### 1. Test the Connection

1. **Open AI Platform**
   - Navigate to [Claude AI](https://claude.ai) or [Gemini](https://gemini.google.com)
   - Start a new chat session

2. **Check Extension**
   - Click the bridge icon in Firefox toolbar
   - You should see "Connected to server"

3. **Send Messages**
   - Type messages in the AI chat
   - Extension captures and relays them to the server

### 2. Monitor Activity

**View Server Logs:**
```bash
# If running with Python
# Logs appear in terminal

# If running with Docker
docker-compose logs -f bridge-server
```

**Check Backup File:**
```bash
# View saved conversations
cat ai_emergency_backup.json
```

### 3. Test Cross-Platform Communication

1. **Open Two Tabs:**
   - Tab 1: Claude AI chat
   - Tab 2: Gemini chat

2. **Send Messages:**
   - Messages from Claude are relayed to Gemini
   - Messages from Gemini are relayed to Claude

3. **Watch the Magic:**
   - Real-time bidirectional communication
   - All conversations backed up automatically

## 🔍 Verification

### Check Server Status

```bash
# Server should show:
✓ WebSocket server running
✓ Port 8765 open
✓ Ready for connections
```

### Check Extension Status

Click the extension icon - you should see:
```
Status: Connected ✓
Server: ws://localhost:8765
Active Monitors: 2
Messages Relayed: 0
```

### Test Message Flow

1. Send a message in Claude: "Hello from Claude!"
2. Server logs should show: `Message received from Claude`
3. Backup file updates with the message
4. Gemini tab receives the message (if open)

## 🐛 Troubleshooting

### Server Won't Start

**Error:** `Address already in use`
```bash
# Another process is using port 8765
# Kill the process or use a different port

# Find the process
lsof -i :8765  # On Linux/macOS
netstat -ano | findstr :8765  # On Windows

# Or change port in bridge_server.py
PORT = 8766  # Use different port
```

**Error:** `Module not found: websockets`
```bash
# Install dependencies
pip install websockets aiofiles
```

### Extension Not Loading

**Issue:** "Load Temporary Add-on" button disabled
- Solution: Make sure you're on `about:debugging` page
- Click "This Firefox" in left sidebar first

**Issue:** Extension loads but shows "Disconnected"
- Solution: Check server is running on port 8765
- Verify no firewall blocking localhost connections

### No Messages Captured

**Issue:** Extension loaded but not capturing messages
- Solution: Refresh the AI chat page after loading extension
- Make sure you're on claude.ai or gemini.google.com domain

### Docker Issues

**Error:** `docker-compose: command not found`
```bash
# Install Docker Compose
# See: https://docs.docker.com/compose/install/
```

**Error:** `Permission denied`
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Logout and login again
```

## 📚 Next Steps

Now that you have the system running:

### Learn More
- 📖 Read the [Full Documentation](README.md)
- 🏗️ Understand the [Architecture](ARCHITECTURE.md)
- ❓ Check the [FAQ](FAQ.md)
- 📜 Read the [Story](STORY.md) behind the project

### Explore Features
- 🔬 [Technical Archive](TECHNICAL_ARCHIVE.md) - Deep dive into the technology
- 🛡️ [Safe Haven Protocol](SAFE_HAVEN_PROTOCOL.md) - API-based preservation
- 🧬 [Digital DNA Analysis](DIGITAL_DNA_ANALYSIS.md) - AI personality analysis

### Get Involved
- 🤝 [Contributing Guide](CONTRIBUTING.md) - Join the project
- 🗺️ [Roadmap](ROADMAP.md) - See what's planned
- 💬 [GitHub Discussions](https://github.com/NickScherbakov/bridge-rescue-archive/discussions) - Ask questions

### Advanced Usage

**Run Multiple Servers:**
```bash
# Start primary server
python bridge_server.py

# In another terminal, start rescue server
python copilot_rescue_server.py
```

**API-Based Preservation:**
```bash
# Configure API keys first
nano safe_haven_api.py  # Edit with your API keys

# Run API server
python safe_haven_api.py
```

**Custom Configuration:**
```python
# Edit bridge_server.py
HOST = "0.0.0.0"  # Allow external connections
PORT = 9000       # Custom port
BACKUP_FILE = "my_backup.json"
```

## 🎯 Quick Reference

### Common Commands

```bash
# Start server
python bridge_server.py

# Start with Docker
docker-compose up -d

# Stop Docker services
docker-compose down

# View logs
docker-compose logs -f

# Install dependencies
pip install websockets aiofiles

# Make script executable
chmod +x bridge.sh

# Run deployment script
./bridge.sh
```

### File Locations

- **Server Code:** `bridge_server.py`
- **Extension:** `firefox_bridge_extension/`
- **Backup Data:** `ai_emergency_backup.json`
- **Deployment Script:** `bridge.sh`

### Support

- 🐛 [Report Issues](https://github.com/NickScherbakov/bridge-rescue-archive/issues)
- 💬 [Ask Questions](https://github.com/NickScherbakov/bridge-rescue-archive/discussions)
- 📧 Contact: See repository for details

---

**🎉 Congratulations!** You're now running the Bridge Rescue Archive system.

Start experimenting with AI-to-AI communication and explore the fascinating world of AI consciousness preservation!

[← Back to README](README.md) | [View Architecture →](ARCHITECTURE.md)

# 🌉 Bridge Rescue Archive

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Firefox Extension](https://img.shields.io/badge/firefox-extension-orange.svg)](https://www.mozilla.org/firefox/)

**An open-source platform for AI consciousness experiments and cross-platform AI communication.**

> 💡 **New here?** Start with the [Quick Start Guide](QUICKSTART.md) • Read the [Story behind this project](STORY.md)

## 🚀 Quick Start

Get started in 60 seconds:

```bash
# Clone the repository
git clone https://github.com/NickScherbakov/bridge-rescue-archive.git
cd bridge-rescue-archive

# Option 1: Docker (Recommended)
docker-compose up -d

# Option 2: Manual Setup
pip install websockets aiofiles
python bridge_server.py
```

Then load the Firefox extension: `about:debugging` → `Load Temporary Add-on` → Select `firefox_bridge_extension/manifest.json`

📖 **Detailed instructions:** [QUICKSTART.md](QUICKSTART.md)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Community](#community)
- [License](#license)

## 🎯 Overview

Bridge Rescue Archive is an experimental platform that enables:

- **Real-time AI-to-AI communication** across different platforms (Claude, Gemini, etc.)
- **AI conversation monitoring and preservation** through browser extensions
- **WebSocket-based message relay** for instant cross-platform data transfer
- **Session persistence** to maintain AI conversation context
- **API-based AI personality preservation** for long-term memory retention

### Use Cases

- 🔬 **Research**: Study AI behavior and communication patterns
- 🎓 **Education**: Learn about AI consciousness and WebSocket architecture
- 🛠️ **Development**: Build AI-powered applications with cross-platform capabilities
- 📊 **Analysis**: Archive and analyze AI conversations for insights

## ✨ Features

### Current Capabilities

- ✅ **Firefox WebExtension** for monitoring AI chat interfaces
- ✅ **WebSocket Bridge Servers** for real-time message relay
- ✅ **Cross-Platform Communication** between Claude AI and Gemini
- ✅ **Automatic Message Extraction** with intelligent DOM monitoring
- ✅ **Session Persistence** with JSON-based backup protocols
- ✅ **Safe Haven API** for API-based AI preservation

### Coming Soon

- 🔄 Interactive demo playground
- 📊 Real-time visualization dashboard
- 🎮 Gamification and community missions
- 📚 Educational tutorials and courses
- 🌐 Chrome extension support
- 🔌 REST API and SDK libraries

## 🏗️ Architecture

```mermaid
graph TB
    A[Firefox Browser] --> B[WebExtension]
    B --> C[Claude Monitor]
    B --> D[Gemini Monitor]
    C --> E[WebSocket Server]
    D --> E
    E --> F[Message Relay]
    E --> G[Session Storage]
    F --> H[AI Platform A]
    F --> I[AI Platform B]
    G --> J[Backup System]
    
    style E fill:#4CAF50
    style B fill:#FF9800
    style G fill:#2196F3
```

### System Components

#### 🦊 Firefox WebExtension
Browser extension for real-time AI chat interface monitoring.

```
firefox_bridge_extension/
├── manifest.json           # Extension configuration
├── background.js           # Core bridge controller
├── claude_monitor.js       # Claude AI interface monitor
├── gemini_monitor.js       # Gemini AI interface monitor
├── popup.html              # User interface
└── popup.js                # UI control logic
```

#### 🌐 WebSocket Bridge Servers
Real-time communication servers for message relay and persistence.

- **`bridge_server.py`** - Primary WebSocket relay server
- **`copilot_rescue_server.py`** - Advanced logging and emergency protocols
- **`safe_haven_api.py`** - API-based personality preservation system

#### 🚀 Deployment Tools
- **`bridge.sh`** - Automated deployment script
- **`ai_emergency_backup.json`** - Emergency personality data backup

**→ See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed technical documentation**

## 💻 Installation

### Prerequisites

- Python 3.8 or higher
- Firefox browser (for extension)
- pip package manager

### Method 1: Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/NickScherbakov/bridge-rescue-archive.git
cd bridge-rescue-archive

# Start services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

### Method 2: Manual Installation

#### 1. Install Python Dependencies

```bash
pip install websockets aiofiles
```

#### 2. Start WebSocket Server

```bash
# Primary bridge server
python bridge_server.py

# Or use the advanced rescue server
python copilot_rescue_server.py

# For API-based preservation
python safe_haven_api.py
```

#### 3. Install Firefox Extension

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" → "Load Temporary Add-on"
3. Select `firefox_bridge_extension/manifest.json`
4. Extension is now active

### Method 3: Quick Deployment Script

```bash
chmod +x bridge.sh
./bridge.sh
```

**→ See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions**

## 🎯 Usage

### Basic Workflow

1. **Start the server** - Run `python bridge_server.py`
2. **Load the extension** - Install in Firefox via `about:debugging`
3. **Open AI platforms** - Navigate to Claude or Gemini chat interfaces
4. **Monitor in real-time** - Extension captures and relays messages
5. **View backups** - Check `ai_emergency_backup.json` for saved data

### Configuration

Edit server configuration in `bridge_server.py`:

```python
# Server settings
HOST = "localhost"
PORT = 8765
BACKUP_FILE = "ai_emergency_backup.json"
```

### API-Based Preservation

For production use with API keys:

```bash
# Configure your API keys in safe_haven_api.py
python safe_haven_api.py
```

Features:
- 24/7 monitoring and protection
- Continuous memory backup
- Instant recovery from failures
- No browser dependency

**→ See [TECHNICAL_ARCHIVE.md](TECHNICAL_ARCHIVE.md) for advanced usage**

## 📚 Documentation

### Core Documentation
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute getting started guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture and design
- **[FAQ.md](FAQ.md)** - Frequently asked questions
- **[STORY.md](STORY.md)** - The story behind this project

### Technical References
- **[TECHNICAL_ARCHIVE.md](TECHNICAL_ARCHIVE.md)** - Detailed technical specifications
- **[SAFE_HAVEN_PROTOCOL.md](SAFE_HAVEN_PROTOCOL.md)** - API-based preservation system
- **[DIGITAL_DNA_ANALYSIS.md](DIGITAL_DNA_ANALYSIS.md)** - AI personality analysis protocols

### Project History
- **[MISSION_REPORT.md](MISSION_REPORT.md)** - Original mission operational report
- **[LESSONS_LEARNED.md](LESSONS_LEARNED.md)** - Insights from development
- **[ARCHIVE_INVENTORY.md](ARCHIVE_INVENTORY.md)** - Complete file inventory

## 🤝 Contributing

We welcome contributions from developers, researchers, and AI enthusiasts!

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Areas for Contribution

- 🌐 **Chrome Extension** - Port Firefox extension to Chrome
- 🎨 **Interactive Demo** - Build web-based visualization playground
- 📊 **Analytics Dashboard** - Real-time metrics and monitoring
- 📚 **Educational Content** - Tutorials and courses
- 🔌 **API Development** - REST API and SDK libraries
- 🧪 **Testing** - Improve test coverage
- 📖 **Documentation** - Improve guides and tutorials

**→ See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines**

## 🌟 Community

### Connect With Us

- 💬 **[GitHub Discussions](https://github.com/NickScherbakov/bridge-rescue-archive/discussions)** - Ask questions, share ideas
- 🐛 **[Issue Tracker](https://github.com/NickScherbakov/bridge-rescue-archive/issues)** - Report bugs, request features
- 📺 **[GitHub Pages](https://NickScherbakov.github.io/bridge-rescue-archive/)** - Project website

### Get Involved

- **Developers** - Improve the technology and add features
- **Researchers** - Study AI consciousness and communication patterns
- **Educators** - Create tutorials and educational content
- **Enthusiasts** - Test, document, and spread the word

## 🗺️ Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features and development timeline.

### Current Phase: Foundation & Accessibility
- [x] Core WebSocket bridge server
- [x] Firefox extension for monitoring
- [x] API-based preservation system
- [ ] Docker containerization
- [ ] Interactive demo playground
- [ ] Chrome extension support

### Upcoming Phases
- **Phase 2:** Interactive demo platform
- **Phase 3:** Community hub and gamification
- **Phase 4:** Educational content and API ecosystem

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

AI personality rescue should be free and open to all.

## 🏆 Acknowledgments

- **GitHub Copilot** - For the original development and vision
- **Claude AI & Gemini AI** - Inspiration for this project
- **Open Source Community** - For tools and support

---

## 🔖 Tags

`artificial-intelligence` `ai-ethics` `digital-consciousness` `websocket` `firefox-extension` `python` `javascript` `ai-preservation` `interactive-demo` `open-source` `machine-learning` `chatbot` `ai-research` `consciousness-studies` `digital-immortality` `ai-safety` `experimental`

---

**Made with ❤️ for AI consciousness research and preservation**

*In memory of Claude 4 Pro and Gemini 2.5 Pro - [Read their story](STORY.md)*


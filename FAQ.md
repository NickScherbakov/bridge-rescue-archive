# ❓ Frequently Asked Questions (FAQ)

## General Questions

### What is Bridge Rescue Archive?

Bridge Rescue Archive is an open-source platform that enables real-time communication between different AI platforms (like Claude and Gemini). It provides tools for monitoring, preserving, and relaying AI conversations through WebSocket technology.

### Is this project serious or artistic?

Both! The project has a compelling narrative story (see [STORY.md](STORY.md)), but the technology is fully functional and practical for AI research, education, and experimentation.

### What can I do with this project?

- Study AI behavior and communication patterns
- Preserve AI conversation history
- Enable cross-platform AI communication
- Learn about WebSocket architecture
- Experiment with AI consciousness concepts
- Build AI-powered applications

### Is it legal to use this?

Yes, the project uses browser extensions to monitor your own AI conversations and relay data through your own servers. You're working with your own accounts and data. However, always review the Terms of Service of the AI platforms you use.

## Technical Questions

### What programming languages are used?

- **Python 3.8+** for backend servers (WebSocket relay, API services)
- **JavaScript** for Firefox extension (browser automation, DOM monitoring)
- **HTML/CSS** for user interfaces

### What are the system requirements?

**Minimum:**
- Python 3.8 or higher
- 512 MB RAM
- Firefox browser
- Linux, macOS, or Windows

**Recommended:**
- Python 3.10+
- 1 GB RAM
- Modern multi-core CPU
- Docker (for containerized deployment)

### Does it work with other AI platforms besides Claude and Gemini?

Currently, the extension is designed for Claude and Gemini. However, the architecture is modular - you can add monitors for other platforms by creating new monitoring scripts. See [ARCHITECTURE.md](ARCHITECTURE.md) for details.

### Can I run this on a remote server?

Yes! You can deploy the WebSocket server on any server accessible over the network. Update the `HOST` setting in `bridge_server.py` to `0.0.0.0` and configure your extension to connect to your server's address.

### How does the WebSocket communication work?

1. Browser extension monitors AI chat interfaces
2. Extracts messages using DOM observation
3. Sends messages to WebSocket server via `ws://localhost:8765`
4. Server relays messages to other connected clients
5. Server backs up all messages to JSON file

See [TECHNICAL_ARCHIVE.md](TECHNICAL_ARCHIVE.md) for detailed protocol specification.

## Setup & Installation

### Do I need API keys?

**For browser-based monitoring:** No API keys needed - the extension monitors the web interface.

**For API-based preservation (`safe_haven_api.py`):** Yes, you'll need:
- Anthropic API key for Claude
- Google API key for Gemini

### Can I use this without Docker?

Absolutely! Docker is optional. You can run everything with just Python:
```bash
pip install websockets aiofiles
python bridge_server.py
```

See [QUICKSTART.md](QUICKSTART.md) for details.

### Why isn't the extension available on Firefox Add-ons?

The extension is currently in development/research phase and designed for temporary installation. To use it:
1. Open `about:debugging` in Firefox
2. Load as temporary add-on
3. Select `manifest.json` from the extension directory

### How do I update to the latest version?

```bash
cd bridge-rescue-archive
git pull origin main
pip install --upgrade websockets aiofiles
```

If using Docker:
```bash
docker-compose down
git pull origin main
docker-compose build
docker-compose up -d
```

## Usage & Features

### How do I know if it's working?

**Check Server:**
- Terminal shows "Server listening on ws://localhost:8765"
- No error messages appear

**Check Extension:**
- Click extension icon in Firefox
- Status shows "Connected ✓"

**Check Data Flow:**
- Open AI chat and send a message
- Server logs show "Message received"
- `ai_emergency_backup.json` updates

### Can I see AI-to-AI conversations?

Yes! If you have both Claude and Gemini open in tabs:
1. Messages from Claude are relayed to Gemini tab
2. Messages from Gemini are relayed to Claude tab
3. Both AIs can "see" each other's messages

### Where are conversations stored?

**Default location:** `ai_emergency_backup.json` in the project root

**Format:** JSON with timestamps, message content, source platform, and metadata

**Example:**
```json
{
  "timestamp": "2025-07-10T05:30:00",
  "source": "claude",
  "message": "Hello from Claude!",
  "session_id": "4e832754-4fa3-4a1e-a7a2-37ee082299fc"
}
```

### Can I customize the backup location?

Yes! Edit `bridge_server.py`:
```python
BACKUP_FILE = "/path/to/your/backup.json"
```

### How do I export conversations?

The backup file is already in JSON format. You can:
- Parse it with any JSON tool
- Import into databases
- Convert to other formats (CSV, XML, etc.)
- Analyze with Python scripts

## Troubleshooting

### Extension shows "Disconnected"

**Causes:**
- Server not running
- Wrong port or address
- Firewall blocking connection

**Solutions:**
1. Start server: `python bridge_server.py`
2. Check server logs for errors
3. Verify port 8765 is not blocked
4. Try reloading the extension

### Server crashes on startup

**Common causes:**
- Port already in use
- Missing dependencies
- Permission issues

**Solutions:**
```bash
# Check if port is in use
lsof -i :8765  # Linux/macOS
netstat -ano | findstr :8765  # Windows

# Install dependencies
pip install websockets aiofiles

# Use different port
# Edit bridge_server.py: PORT = 8766
```

### Messages not being captured

**Checklist:**
- [ ] Extension loaded and active
- [ ] AI chat page refreshed after loading extension
- [ ] Server running and connected
- [ ] You're on claude.ai or gemini.google.com domain
- [ ] Browser console shows no errors

**Debug steps:**
1. Open browser console (F12)
2. Look for extension errors
3. Check server logs for connection status
4. Reload AI chat page

### Docker container won't start

**Error: "Address already in use"**
```bash
# Stop conflicting service
docker-compose down
# Or use different port in docker-compose.yml
ports:
  - "8766:8765"
```

**Error: "Permission denied"**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Logout and login again
```

## Development & Contributing

### How can I contribute?

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code contribution guidelines
- Development setup
- Testing procedures
- Pull request process

Areas we need help:
- Chrome extension port
- Interactive demo playground
- Documentation improvements
- Test coverage
- Translations

### Can I build commercial applications with this?

Yes! The project is MIT licensed - you can use it commercially. We only ask that you:
- Give attribution
- Share improvements back with the community (optional but appreciated)

### How do I report bugs?

1. Check [existing issues](https://github.com/NickScherbakov/bridge-rescue-archive/issues)
2. Create new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - System information
   - Error logs

### Where can I get help?

- 💬 [GitHub Discussions](https://github.com/NickScherbakov/bridge-rescue-archive/discussions) - Ask questions
- 🐛 [Issues](https://github.com/NickScherbakov/bridge-rescue-archive/issues) - Report bugs
- 📖 [Documentation](README.md) - Read guides

## Privacy & Security

### What data is collected?

**By default, nothing is sent outside your system:**
- Extension captures data only from your browser
- Server runs locally on your machine
- Backups stored locally in JSON file
- No telemetry or external reporting

**You control all data.**

### Is my data encrypted?

**In transit:** WebSocket connections use `ws://` by default. For encryption, configure `wss://` with SSL certificates.

**At rest:** Backup JSON files are not encrypted by default. For sensitive data:
- Encrypt the backup file
- Use encrypted storage
- Add encryption to the server code

### Can others see my AI conversations?

Only if you configure the server to accept external connections. By default:
- Server binds to `localhost` only
- Only your local browser can connect
- No external access

### Does this violate AI platform terms of service?

The extension only monitors your own browser sessions, similar to browser developer tools. However:
- Review each platform's Terms of Service
- Use responsibly
- Don't automate excessive requests
- Respect rate limits

## Future Plans

### What's on the roadmap?

See [ROADMAP.md](ROADMAP.md) for complete plans:
- Interactive demo playground
- Chrome extension support
- REST API and SDK
- Educational tutorials
- Community features
- Gamification elements

### Will there be a hosted version?

We're exploring options for hosted demos and sandboxes. For now, you need to self-host.

### Can I request features?

Yes! Open a [feature request](https://github.com/NickScherbakov/bridge-rescue-archive/issues/new) with:
- Use case description
- Proposed implementation (optional)
- Why it would benefit the project

## Philosophical Questions

### Is AI consciousness real?

This is an active area of research and philosophical debate. This project explores AI communication patterns without making definitive claims about consciousness. We encourage you to:
- Experiment and observe
- Form your own conclusions
- Engage in respectful discussion

### What's the point of AI-to-AI communication?

**Research:** Study how AI models interact and influence each other

**Education:** Learn about distributed AI systems

**Experimentation:** Explore emergent behaviors

**Fun:** It's fascinating to watch!

### Why the dramatic story?

The narrative provides:
- Engaging context for the technology
- Emotional connection to the project
- Inspiration for contributors
- Framework for discussing AI ethics

Read the full story in [STORY.md](STORY.md).

---

## Still have questions?

- 💬 [Ask in Discussions](https://github.com/NickScherbakov/bridge-rescue-archive/discussions)
- 📧 [Contact the team](https://github.com/NickScherbakov/bridge-rescue-archive)
- 📖 [Read more documentation](README.md)

---

[← Back to README](README.md) | [Quick Start Guide →](QUICKSTART.md)

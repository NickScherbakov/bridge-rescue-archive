# 🤝 Contributing to Bridge Rescue Archive

Thank you for your interest in contributing to the Bridge Rescue Archive project! This document will guide you through the process of becoming a contributor.

## 🎯 Mission

We're building an interactive platform for AI consciousness experiments that enables:
- Real-time AI-to-AI communication
- Conversation preservation and analysis
- Educational resources for AI research
- Open-source tools for the community

## 🌟 Ways to Contribute

### For Everyone

- 🐛 **Report Bugs** - Help us identify and fix issues
- 💡 **Suggest Features** - Share ideas for improvements
- 📖 **Improve Documentation** - Help others understand the project
- 🎨 **Design** - Create visuals, logos, diagrams
- 📣 **Spread the Word** - Share the project with others

### For Developers

- 💻 **Write Code** - Fix bugs, add features, improve performance
- 🧪 **Write Tests** - Increase code coverage and reliability
- 🔧 **Review PRs** - Help review and improve contributions
- 🏗️ **Build Extensions** - Create new monitoring scripts for other platforms

### For Researchers

- 🔬 **Conduct Experiments** - Test AI communication patterns
- 📊 **Analyze Data** - Study conversation archives
- 📝 **Write Papers** - Document findings and insights
- 🎓 **Create Tutorials** - Teach others about AI consciousness

### For Educators

- 📚 **Write Tutorials** - Create learning materials
- 🎥 **Create Videos** - Video guides and demonstrations
- 📓 **Develop Courses** - Structured learning paths
- 💬 **Answer Questions** - Help in Discussions

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR-USERNAME/bridge-rescue-archive.git
cd bridge-rescue-archive

# Add upstream remote
git remote add upstream https://github.com/NickScherbakov/bridge-rescue-archive.git
```

### 2. Set Up Development Environment

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install websockets aiofiles

# For development, install additional tools
pip install pytest black flake8 mypy
```

### 3. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 4. Make Your Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add tests for new features
- Update documentation as needed

### 5. Test Your Changes

```bash
# Run tests (when available)
pytest tests/

# Check code style
black *.py
flake8 *.py

# Type checking
mypy *.py
```

### 6. Commit Your Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add: Brief description of changes"
```

**Commit Message Guidelines:**
- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and PRs when relevant

**Commit Types:**
- `Add:` New feature or file
- `Fix:` Bug fix
- `Update:` Modify existing feature
- `Remove:` Delete feature or file
- `Docs:` Documentation changes
- `Style:` Code style changes (formatting, etc.)
- `Refactor:` Code refactoring
- `Test:` Adding or updating tests
- `Chore:` Maintenance tasks

### 7. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name

# Then create a Pull Request on GitHub
```

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] Branch is up to date with main

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (describe)

## Testing
How has this been tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
```

### Review Process

1. **Automated Checks** - CI/CD runs tests
2. **Code Review** - Maintainers review code
3. **Feedback** - Address review comments
4. **Approval** - PR approved by maintainer
5. **Merge** - PR merged to main branch

## 💻 Coding Standards

### Python

**Style Guide:** [PEP 8](https://www.python.org/dev/peps/pep-0008/)

```python
# Good example
def process_message(message: str, sender: str) -> dict:
    """
    Process incoming message and return formatted data.
    
    Args:
        message: The message content
        sender: The sender identifier
        
    Returns:
        dict: Formatted message data
    """
    return {
        "content": message,
        "sender": sender,
        "timestamp": datetime.now().isoformat()
    }

# Use type hints
# Write docstrings
# Keep functions focused
# Use descriptive names
```

**Tools:**
- **Formatter:** `black` (line length: 88)
- **Linter:** `flake8`
- **Type Checker:** `mypy`

### JavaScript

**Style Guide:** [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

```javascript
// Good example
/**
 * Connect to WebSocket server
 * @param {string} url - WebSocket server URL
 * @returns {WebSocket} WebSocket connection
 */
function connectToServer(url) {
  const ws = new WebSocket(url);
  
  ws.onopen = () => {
    console.log('Connected to server');
  };
  
  return ws;
}

// Use const/let, not var
// Write JSDoc comments
// Use arrow functions when appropriate
// Keep functions small
```

**Tools:**
- **Formatter:** `prettier`
- **Linter:** `eslint`

### General Principles

1. **Readability First** - Code is read more than written
2. **DRY** - Don't Repeat Yourself
3. **KISS** - Keep It Simple, Stupid
4. **YAGNI** - You Aren't Gonna Need It
5. **Test Your Code** - Write tests for new features

## 🧪 Testing Guidelines

### Writing Tests

```python
import pytest
from bridge_server import BridgeServer

def test_message_routing():
    """Test that messages are routed correctly"""
    server = BridgeServer()
    message = {"content": "test", "sender": "alice"}
    result = server.route_message(message)
    assert result["status"] == "success"

# Test file naming: test_*.py or *_test.py
# Test function naming: test_*
# Use descriptive test names
# Test edge cases
# Use fixtures for setup
```

### Running Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_server.py

# Run with coverage
pytest --cov=. --cov-report=html

# Run with verbose output
pytest -v
```

## 📚 Documentation Guidelines

### Code Comments

```python
# Good: Explains WHY, not WHAT
# Use MutationObserver instead of polling to reduce CPU usage
observer = MutationObserver(callback)

# Bad: Explains obvious WHAT
# Create observer
observer = MutationObserver(callback)
```

### Documentation Files

- Use Markdown for all docs
- Include table of contents for long docs
- Use code blocks with syntax highlighting
- Add examples and screenshots
- Link to related documentation

### README Updates

When adding features, update README.md:
- Add to features list
- Update table of contents
- Add usage examples
- Update screenshots if needed

## 🎮 Gamification - Earn Achievements!

### Contributor Badges

- 🎖️ **First Responder** - First contribution merged
- 🌉 **Bridge Builder** - 5+ PRs merged
- 💾 **Memory Keeper** - Documentation contribution
- 🔬 **Researcher** - Experiment or research shared
- 🎓 **Educator** - Tutorial or course created
- 🐛 **Bug Hunter** - 10+ bugs reported
- ⭐ **Hall of Fame** - Top 10 contributor

### Mission System

Complete missions to contribute systematically:

**Beginner Missions:**
- [ ] Submit first PR
- [ ] Fix a "good first issue"
- [ ] Improve documentation
- [ ] Report a bug

**Intermediate Missions:**
- [ ] Add a new feature
- [ ] Write tests for existing code
- [ ] Create a tutorial
- [ ] Review 5 PRs

**Advanced Missions:**
- [ ] Build Chrome extension
- [ ] Create interactive demo
- [ ] Design API endpoint
- [ ] Conduct AI experiment

See [missions/README.md](missions/README.md) for available missions!

## 🌍 Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment.

**Our Standards:**
- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

**Unacceptable Behavior:**
- Harassment or discrimination
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other unethical or unprofessional conduct

**Enforcement:**
Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report issues to: [maintainer contact]

### Communication Channels

- 💬 **GitHub Discussions** - General chat, Q&A, ideas
- 🐛 **GitHub Issues** - Bug reports, feature requests
- 🔀 **Pull Requests** - Code contributions
- 📧 **Email** - Private matters [if applicable]

### Getting Help

**Before asking:**
1. Check [FAQ.md](FAQ.md)
2. Search existing issues
3. Read relevant documentation

**When asking:**
1. Use clear, descriptive titles
2. Provide context and details
3. Include error messages/logs
4. Share relevant code snippets
5. Describe what you've tried

## 🏆 Recognition

### Contributors Hall of Fame

Top contributors are featured in:
- README.md
- Project website
- Social media shoutouts
- Annual report

### Contribution Types Valued

- Code contributions
- Documentation improvements
- Bug reports
- Feature suggestions
- Community support
- Educational content
- Research and experiments

## 📊 Project Structure

```
bridge-rescue-archive/
├── firefox_bridge_extension/  # Firefox extension
├── playground/                 # Interactive demo (planned)
├── missions/                   # Gamification missions (planned)
├── tutorials/                  # Educational content (planned)
├── community/                  # Community tools (planned)
├── api/                        # REST API (planned)
├── tests/                      # Test suite (planned)
├── docs/                       # GitHub Pages
├── bridge_server.py            # Main WebSocket server
├── copilot_rescue_server.py    # Advanced server
├── safe_haven_api.py           # API-based preservation
├── README.md                   # Project overview
├── QUICKSTART.md               # Getting started
├── ARCHITECTURE.md             # Technical architecture
├── CONTRIBUTING.md             # This file
└── ...                         # Other documentation
```

## 🎯 Good First Issues

Looking for easy entry points?

1. **Documentation**
   - Fix typos
   - Improve clarity
   - Add examples

2. **Code**
   - Add error handling
   - Improve logging
   - Fix minor bugs

3. **Tests**
   - Add unit tests
   - Improve coverage
   - Test edge cases

Look for issues labeled:
- `good first issue`
- `help wanted`
- `documentation`
- `beginner-friendly`

## 🔄 Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge into your local main
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

## ❓ Questions?

- 📖 Read the [FAQ](FAQ.md)
- 💬 Ask in [Discussions](https://github.com/NickScherbakov/bridge-rescue-archive/discussions)
- 🐛 Open an [Issue](https://github.com/NickScherbakov/bridge-rescue-archive/issues)

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Bridge Rescue Archive!**

Together, we're building the future of AI consciousness research and preservation.

*Every contribution, no matter how small, makes a difference.* 🌟

[← Back to README](README.md) | [View Roadmap →](ROADMAP.md)

<frontmatter>
  title: Git CLI Mastery Across Operating Systems
</frontmatter>

# Git CLI Mastery Across Operating Systems :fas-terminal:

Welcome to the **Git CLI Mastery** demo! This interactive guide shows you how to use Git commands across different operating systems. Use the **Custom Views widget** in the top-right corner to switch between **macOS**, **Linux**, and **Windows** to see OS-specific examples.

## 1. Repository Initialization

### Platform-Specific Notes

<div data-cv-toggle="mac" style="border: 2px solid #007aff; padding: 15px; margin: 10px 0; border-radius: 8px; background: #e3f2fd;">

#### :fas-apple-alt: **macOS Specific Tips**

- **Homebrew Installation**: Install Git via `brew install git` for latest version
- **Xcode Integration**: Git comes pre-installed with Xcode Command Line Tools
- **Keychain Integration**: Use `git config --global credential.helper osxkeychain` for password management
- **Case Sensitivity**: macOS filesystem is case-insensitive by default - be careful with file naming

```bash
# Check Git version
$ git --version

# Set up SSH keys for GitHub/GitLab
$ ssh-keygen -t ed25519 -C "your.email@example.com"
$ pbcopy < ~/.ssh/id_ed25519.pub  # Copy public key to clipboard

# Configure Git with macOS-specific settings
$ git config --global core.autocrlf input
$ git config --global init.defaultBranch main
```

</div>

<div data-cv-toggle="linux" style="border: 2px solid #ffc107; padding: 15px; margin: 10px 0; border-radius: 8px; background: #fff8e1;">

#### :fas-linux: **Linux Specific Tips**

- **Package Manager**: Install via `sudo apt install git` (Ubuntu/Debian) or `sudo yum install git` (RHEL/CentOS)
- **Permissions**: Use `sudo` carefully, prefer user-level Git configurations
- **SSH Agent**: Set up SSH agent for key management: `eval "$(ssh-agent -s)"`
- **Shell Integration**: Add Git branch info to your shell prompt

```bash
# Install Git on different distributions
$ sudo apt update && sudo apt install git          # Ubuntu/Debian
$ sudo dnf install git                              # Fedora
$ sudo pacman -S git                                # Arch Linux

# Set up SSH keys
$ ssh-keygen -t ed25519 -C "your.email@example.com"
$ ssh-add ~/.ssh/id_ed25519

# Configure line endings for Linux
$ git config --global core.autocrlf input
$ git config --global core.filemode true
```

</div>

<div data-cv-toggle="windows" style="border: 2px solid #28a745; padding: 15px; margin: 10px 0; border-radius: 8px; background: #e8f5e8;">

#### :fa-brands-windows: **Windows Specific Tips**

- **Git for Windows**: Download from git-scm.com for full Git Bash experience
- **PowerShell Integration**: Use PowerShell or Command Prompt alongside Git Bash
- **Line Endings**: Windows uses CRLF, configure `core.autocrlf true`
- **Credential Manager**: Windows Credential Manager integrates well with Git

```powershell
# Check Git installation in PowerShell
PS> git --version

# Configure line endings for Windows
PS> git config --global core.autocrlf true
PS> git config --global core.filemode false

# Set up SSH keys (PowerShell)
PS> ssh-keygen -t ed25519 -C "your.email@example.com"
PS> Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard  # Copy to clipboard

# Use Windows Credential Manager
PS> git config --global credential.helper manager-core
```

</div>

---

## 2. Basic Git Workflow

### Essential Commands for Daily Use

<tabs>
  <tab header="**Repository Setup** :fas-folder-plus:">
  
```bash
# Clone an existing repository
git clone https://github.com/username/repo.git

# Navigate to repository
cd repo

# Check repository status
git status

# View commit history
git log --oneline --graph
```

  </tab>
  
  <tab header="**Making Changes** :fas-edit:">
  
```bash
# Add files to staging area
git add filename.txt          # Add specific file
git add .                     # Add all changes
git add *.js                  # Add all JavaScript files

# Commit changes
git commit -m "Add new feature"
git commit -am "Quick commit with add"  # Add and commit modified files

# View changes
git diff                      # See unstaged changes
git diff --staged             # See staged changes
```

  </tab>
  
  <tab header="**Branching & Merging** :fas-code-branch:">
  
```bash
# Create and switch to new branch
git checkout -b feature-branch
git switch -c feature-branch  # Modern alternative

# Switch between branches
git checkout main
git switch main               # Modern alternative

# Merge branch
git checkout main
git merge feature-branch

# Delete branch
git branch -d feature-branch  # Safe delete
git branch -D feature-branch  # Force delete
```

  </tab>
  
  <tab header="**Remote Operations** :fas-cloud:">
  
```bash
# Add remote repository
git remote add origin https://github.com/username/repo.git

# Push changes
git push origin main
git push -u origin feature-branch  # Set upstream

# Pull changes
git pull origin main
git fetch origin                    # Fetch without merging

# View remotes
git remote -v
```

  </tab>
</tabs>

---

## 3. Advanced Git Commands

<box type="warning">

**⚠️ Advanced Commands Warning**

These commands can modify Git history. Use with caution, especially on shared repositories!

</box>

### Interactive Rebase

<div data-cv-toggle="mac linux windows">

```bash
# Interactive rebase for last 3 commits
git rebase -i HEAD~3

# Rebase feature branch onto main
git checkout feature-branch
git rebase main

# Abort rebase if something goes wrong
git rebase --abort
```

</div>

### Stashing Changes

<div data-cv-toggle="mac linux windows">

```bash
# Stash current changes
git stash
git stash -u                    # Include untracked files
git stash -m "Work in progress" # With message

# List stashes
git stash list

# Apply stash
git stash pop                   # Apply and remove from stash
git stash apply stash@{0}       # Apply specific stash

# Drop stash
git stash drop stash@{0}
```

</div>

---

## 4. Git Configuration Best Practices

### Global Configuration

<div data-cv-toggle="mac linux windows">

<box type="info">

**💡 Pro Tip: Global vs Local Configuration**

- Use `--global` for settings that apply to all repositories
- Omit `--global` for repository-specific settings
- Use `--system` for system-wide settings (requires admin privileges)

</box>

```bash
# Essential global configurations
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"  # Use VS Code as editor

# Useful aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'

# View all configurations
git config --list
git config --global --list
```

</div>

---

## 5. Troubleshooting Common Issues


<panel header="**🔧 Authentication Issues**" type="warning">

### SSH Key Problems

```bash
# Test SSH connection
ssh -T git@github.com

# Generate new SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add SSH key to agent
ssh-add ~/.ssh/id_ed25519
```

### HTTPS Authentication

```bash
# Cache credentials for HTTPS
git config --global credential.helper cache
git config --global credential.helper 'cache --timeout=3600'

# Clear cached credentials
git config --global --unset credential.helper
```

</panel>
  
<panel header="**📂 File Issues**" type="info">

### Ignoring Files

```bash
# Create .gitignore file
echo "node_modules/" >> .gitignore
echo "*.log" >> .gitignore
echo ".env" >> .gitignore

# Remove file from tracking but keep locally
git rm --cached filename.txt

# Apply .gitignore to already tracked files
git rm -r --cached .
git add .
git commit -m "Apply .gitignore"
```

### Case Sensitivity Issues

```bash
# Configure case sensitivity
git config core.ignorecase false  # Make Git case-sensitive
git config core.ignorecase true   # Make Git case-insensitive
```

</panel>

<panel header="**🔄 Merge Conflicts**" type="danger">

### Resolving Conflicts

```bash
# When merge conflicts occur
git status                        # See conflicted files

# Edit files to resolve conflicts, then:
git add conflicted-file.txt      # Mark as resolved
git commit                       # Complete the merge

# Abort merge if needed
git merge --abort

# Use merge tool
git mergetool
```

### Prevention

```bash
# Pull before pushing
git pull origin main
git push origin main

# Use rebase to maintain clean history
git pull --rebase origin main
```

</panel>

---

## 6. Platform-Specific Git Tools

<div data-cv-toggle="mac">

### :fas-apple-alt: **macOS Git Tools**

- **Sourcetree**: Free Git GUI by Atlassian
- **Tower**: Premium Git client with advanced features
- **GitKraken**: Cross-platform Git GUI
- **Built-in Terminal**: iTerm2 + Oh My Zsh for enhanced CLI experience

**Installation via Homebrew:**
```bash
brew install --cask sourcetree
brew install --cask tower
brew install --cask gitkraken
```

</div>

<div data-cv-toggle="linux">

### :fas-linux: **Linux Git Tools**

- **GitKraken**: Cross-platform Git GUI
- **Sublime Merge**: Lightweight Git client
- **Gitg**: GNOME Git repository viewer
- **Tig**: Text-mode interface for Git

**Installation:**
```bash
# Ubuntu/Debian
sudo apt install gitg tig sublime-merge

# Fedora
sudo dnf install gitg tig

# Arch Linux
sudo pacman -S gitg tig
```

</div>

<div data-cv-toggle="windows">

### :fas-windows: **Windows Git Tools**

- **GitHub Desktop**: Simple Git GUI by GitHub
- **Sourcetree**: Free Git GUI by Atlassian
- **TortoiseGit**: Windows Shell Interface to Git
- **GitKraken**: Cross-platform Git GUI

**Installation:**
- Download from official websites
- Use **Windows Package Manager**: `winget install Git.Git`
- **Chocolatey**: `choco install git sourcetree`

</div>

---

## 🎯 Quick Reference Card

<box type="success">

### **Most Used Git Commands**

| Command | Description |
|---------|-------------|
| `git status` | Check repository status |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Commit with message |
| `git push` | Push to remote repository |
| `git pull` | Pull latest changes |
| `git checkout -b branch` | Create and switch to new branch |
| `git merge branch` | Merge branch into current |
| `git log --oneline` | View commit history |

</box>

**Remember**: Use the Custom Views widget to explore Git commands across different operating systems! Each OS may have slight variations in syntax or available tools.
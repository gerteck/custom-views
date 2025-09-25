<frontmatter>
  title: File System Structures Across Operating Systems
</frontmatter>

# File System Structures Across Operating Systems :fas-folder-tree:

Explore how different operating systems organize files, install applications, and manage system resources. Use the **Custom Views widget** in the top-right corner to switch between **macOS**, **Linux**, and **Windows** to see platform-specific file structures.

---

## Platform-Specific File Organization

<div data-customviews-toggle="mac" style="border: 2px solid #007aff; padding: 15px; margin: 10px 0; border-radius: 8px; background: #e3f2fd;">

### :fas-apple-alt: **macOS File System**

**Key Characteristics:**
- **App Bundles**: Applications are packaged as `.app` bundles
- **Framework System**: Shared libraries in `/System/Library/Frameworks/`
- **User Library**: Personal preferences in `~/Library/`
- **SIP Protection**: System Integrity Protection guards system directories

**Common Directories:**
- `/Applications/` - User-installed applications
- `/Library/` - System-wide libraries and preferences
- `/System/` - Core system files (read-only)
- `/Users/` - User home directories

</div>

<div data-customviews-toggle="linux" style="border: 2px solid #ffc107; padding: 15px; margin: 10px 0; border-radius: 8px; background: #fff8e1;">

### :fas-linux: **Linux File System**

**Key Characteristics:**
- **FHS Compliance**: Follows Filesystem Hierarchy Standard
- **Package Management**: Software via package managers (apt, yum, pacman)
- **Configuration in /etc**: System-wide config centralized
- **Virtual Filesystems**: `/proc` and `/sys` provide system info

**Common Directories:**
- `/bin/` - Essential command binaries
- `/etc/` - Configuration files
- `/home/` - User home directories
- `/usr/` - User utilities and applications

</div>

<div data-customviews-toggle="windows" style="border: 2px solid #28a745; padding: 15px; margin: 10px 0; border-radius: 8px; background: #e8f5e8;">

### :fas-windows: **Windows File System**

**Key Characteristics:**
- **Drive Letters**: Uses drive letters (C:, D:, etc.)
- **Registry**: Configuration in Windows Registry
- **AppData Structure**: Three levels of application data
- **Program Files Separation**: 32-bit and 64-bit apps separate

**Common Directories:**
- `C:\Program Files\` - 64-bit applications
- `C:\Program Files (x86)\` - 32-bit applications
- `C:\Windows\` - Windows system files
- `C:\Users\` - User profiles

</div>

---

## Configuration File Locations

<tabs>

  <tab header="**macOS Config** :fas-apple-alt:">

<div data-customviews-toggle="mac">

```bash
# System-wide configurations
/etc/                     # System configuration files
/Library/Preferences/     # System preferences
/Library/LaunchDaemons/   # System launch daemons

# User configurations  
~/Library/Preferences/    # User preferences (.plist files)
~/.ssh/config            # SSH configuration
~/.gitconfig             # Git configuration
```

</div>

  </tab>
  
  <tab header="**Linux Config** :fas-linux:">

<div data-customviews-toggle="linux">

```bash
# System-wide configurations
/etc/                     # System configuration directory
/etc/systemd/system/      # Systemd service files
/etc/hosts               # Host file

# User configurations
~/.config/               # XDG config directory
~/.bashrc               # Bash configuration
~/.ssh/config           # SSH configuration
```

</div>

  </tab>
  
  <tab header="**Windows Config** :fas-windows:">

<div data-customviews-toggle="windows">

```powershell
# System-wide configurations
C:\Windows\System32\drivers\etc\hosts  # Host file
C:\ProgramData\                         # Shared app data

# User configurations
%APPDATA%\                              # Roaming app data
%LOCALAPPDATA%\                         # Local app data
%USERPROFILE%\.gitconfig                # Git configuration
```

</div>

  </tab>
</tabs>

---

## Quick File Operations Reference

<box type="success">

### **Essential Commands by Platform**

| Action | macOS/Linux | Windows PowerShell |
|--------|-------------|-------------------|
| List files | `ls -la` | `Get-ChildItem` |
| Change directory | `cd /path/to/dir` | `cd C:\path\to\dir` |
| Copy file | `cp file.txt dest/` | `Copy-Item file.txt dest\` |
| Create directory | `mkdir dirname` | `New-Item -Type Directory dirname` |

</box>

**🔄 Switch Platforms**: Use the Custom Views widget to explore how each operating system organizes files differently!

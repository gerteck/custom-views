# Custom Views Library Documentation

This directory contains the comprehensive documentation and live demo for the Custom Views library.

## Quick Start

### For Development
1. Install MarkBind: `npm install -g markbind-cli`
2. Navigate to docs directory: `cd docs`
3. Start development server: `markbind serve`
4. Open http://localhost:8080

### For Production Build
1. Build the site: `markbind build`
2. Deploy the `_site` directory

## Documentation Structure

- **index.md** - Main landing page with library overview and interactive demo
- **contents/concepts.md** - Core concepts and terminology
- **contents/configuration.md** - Setup and configuration guide
- **contents/syntax.md** - HTML attributes and JavaScript API reference
- **contents/demo.md** - Interactive examples and use cases
- **contents/architecture.md** - Developer guide and library internals
- **configs/** - Demo configuration files
- **assets/** - Demo assets (images, etc.)

## Features

This documentation site serves multiple purposes:

1. **User Guide** - Complete reference for using the library
2. **Developer Guide** - Architecture and extension documentation
3. **Live Demo** - Interactive examples showing library capabilities
4. **API Reference** - Complete JavaScript and HTML attribute documentation

## Interactive Demo

The documentation includes a fully functional demo that demonstrates:

- Dynamic placeholder content switching
- Toggle-based content visibility
- Profile and state management
- URL parameter handling
- Persistence across sessions
- Widget-based user interaction

Use the "Custom Views" widget in the top-right corner to interact with the demo.

## Configuration Files

The demo uses the following configuration structure:

- `configs/assets.json` - Defines all available content assets
- `configs/defaultState.json` - Default state when no profile is selected
- `configs/profileA.json` - Configuration for Profile A
- `configs/profileB.json` - Configuration for Profile B

## Development Notes

- The site uses MarkBind for static site generation
- The Custom Views library is loaded from `/dist/custom-views.esm.js`
- Plugin configuration is in `_markbind/plugins/customviews.js`
- All documentation pages demonstrate the library in action

## Deploying Updates

After making changes to the library:

1. Build the library: `npm run build` (from project root)
2. The docs automatically use the latest build from `/dist/`
3. Test locally: `markbind serve` (from docs directory)
4. Deploy: `markbind build` and upload `_site` directory

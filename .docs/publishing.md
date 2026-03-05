# Development & Publishing Guide

This guide explains how to build, test, and publish the **Copy Lines for AI** extension.

## 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed, then install the VS Code Extension Manager (`vsce`) globally:

```bash
npm install -g @vscode/vsce
```

## 2. Local Development & Testing

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Launch Extension**:
   - Open the project in VS Code.
   - Press `F5` to open a new "Extension Development Host" window.
   - Test the right-click "Copy Lines" functionality in any file within that window.

## 3. Packaging (.vsix)

To create a `.vsix` file for manual installation or sharing:

```bash
npm run package
```
This generates `copy-lines-for-ai-x.x.x.vsix` in the root directory.

## 4. Publishing to VS Code Marketplace

### A. Create a Publisher
If you haven't already, create a publisher on the [Visual Studio Marketplace Management portal](https://marketplace.visualstudio.com/manage).

### B. Login via Terminal
You'll need a Personal Access Token (PAT) from Azure DevOps.
```bash
vsce login <publisher-name>
```

### C. Publish to Marketplace
To push the extension live to the marketplace:
```bash
vsce publish
```
*Note: This will automatically increment the version unless specified otherwise.*

## 5. GitHub Release Automation

I have set up a GitHub Action (`.github/workflows/release.yml`) to automate VSIX creation.

### How to create a GitHub Download:
1. **Push your code** to GitHub.
2. **Create a Tag** and push it:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
3. GitHub will automatically:
   - Build the extension.
   - Create a new **Release** on your repository.
   - Attach the `.vsix` file to that release for users to download.

Alternatively, you can trigger this manually in the **Actions** tab on GitHub by selecting "Build and Release" and clicking "Run workflow".


## 6. Summary of Useful Commands

| Command | Description |
|---------|-------------|
| `npm run package` | Build the `.vsix` package |
| `vsce package` | Same as above (direct) |
| `vsce publish` | Upload and publish to Marketplace |

## 7. Manual Installation

If you want to install your `.vsix` locally without publishing:
1. Open VS Code.
2. Go to the **Extensions** view (`Cmd+Shift+X`).
3. Click the **...** (Views and More Actions) menu in the top right.
4. Select **Install from VSIX...** and pick your generated file.

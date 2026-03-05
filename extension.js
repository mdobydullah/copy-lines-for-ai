const vscode = require('vscode');
const path = require('path');

/**
 * Get the file path relative to workspace root (or absolute if no workspace)
 */
function getFilePath(document, useRelative) {
  const filePath = document.uri.fsPath;

  if (useRelative && vscode.workspace.workspaceFolders?.length) {
    const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const relative = path.relative(workspaceRoot, filePath);
    // Use forward slashes always (nicer for AI/terminal context)
    return relative.replace(/\\/g, '/');
  }

  return filePath.replace(/\\/g, '/');
}

/**
 * Build the line range string, e.g. "line36" or "line36-39"
 */
function getLineRange(selection) {
  const startLine = selection.start.line + 1; // VS Code is 0-indexed
  const endLine = selection.end.line + 1;

  if (startLine === endLine) {
    return `line${startLine}`;
  }
  return `line${startLine}-${endLine}`;
}

/**
 * Command 1: Copy just the path + line range
 * Output: k8s/templates/clickhouse.yaml:line36-39
 */
async function copyWithPath() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const config = vscode.workspace.getConfiguration('copyLinesForAI');
  const useRelative = config.get('useRelativePath', true);

  const filePath = getFilePath(editor.document, useRelative);
  const lineRange = getLineRange(editor.selection);

  const result = `${filePath}:${lineRange}`;

  await vscode.env.clipboard.writeText(result);
  vscode.window.setStatusBarMessage(`✅ Copied: ${result}`, 3000);
}

/**
 * Command 2: Copy path + line range + the actual code content
 * Output:
 * k8s/templates/clickhouse.yaml:line36-39
 * ```yaml
 * ... selected code ...
 * ```
 */
async function copyWithPathAndContent() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const config = vscode.workspace.getConfiguration('copyLinesForAI');
  const useRelative = config.get('useRelativePath', true);
  const includeLanguageHint = config.get('includeLanguageHint', true);

  const filePath = getFilePath(editor.document, useRelative);
  const lineRange = getLineRange(editor.selection);
  const selectedText = editor.document.getText(editor.selection);

  // Get language id for syntax hint (e.g. "yaml", "php", "javascript")
  const langId = includeLanguageHint ? editor.document.languageId : '';

  let result;
  if (includeLanguageHint && langId) {
    result = `${filePath}:${lineRange}\n\`\`\`${langId}\n${selectedText}\n\`\`\``;
  } else {
    result = `${filePath}:${lineRange}\n${selectedText}`;
  }

  await vscode.env.clipboard.writeText(result);
  vscode.window.setStatusBarMessage(`✅ Copied with content: ${filePath}:${lineRange}`, 3000);
}

async function copyWithFullPath() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const filePath = getFilePath(editor.document, false);
  const lineRange = getLineRange(editor.selection);

  const result = `${filePath}:${lineRange}`;

  await vscode.env.clipboard.writeText(result);
  vscode.window.setStatusBarMessage(`✅ Copied: ${result}`, 3000);
}

async function copyWithFullPathAndContent() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const config = vscode.workspace.getConfiguration('copyLinesForAI');
  const includeLanguageHint = config.get('includeLanguageHint', true);

  const filePath = getFilePath(editor.document, false);
  const lineRange = getLineRange(editor.selection);
  const selectedText = editor.document.getText(editor.selection);

  const langId = includeLanguageHint ? editor.document.languageId : '';

  let result;
  if (includeLanguageHint && langId) {
    result = `${filePath}:${lineRange}\n\`\`\`${langId}\n${selectedText}\n\`\`\``;
  } else {
    result = `${filePath}:${lineRange}\n${selectedText}`;
  }

  await vscode.env.clipboard.writeText(result);
  vscode.window.setStatusBarMessage(`✅ Copied with content: ${filePath}:${lineRange}`, 3000);
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('copyLinesForAI.copyWithPath', copyWithPath),
    vscode.commands.registerCommand('copyLinesForAI.copyWithPathAndContent', copyWithPathAndContent),
    vscode.commands.registerCommand('copyLinesForAI.copyWithFullPath', copyWithFullPath),
    vscode.commands.registerCommand('copyLinesForAI.copyWithFullPathAndContent', copyWithFullPathAndContent)
  );
}

function deactivate() { }

module.exports = { activate, deactivate };

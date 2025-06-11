// Make this file a module by adding an export
export {};

// Extend Window interface to include File System Access API
declare global {
  interface Window {
    showOpenFilePicker(options?: {
      multiple?: boolean;
      types?: { description: string; accept: Record<string, string[]> }[];
    }): Promise<[FileSystemFileHandle]>;
    showSaveFilePicker(options?: {
      suggestedName?: string;
      types?: { description: string; accept: Record<string, string[]> }[];
    }): Promise<FileSystemFileHandle>;
  }
}

// Type definitions for the File System Access API
interface FileSystemHandle {
  readonly kind: 'file' | 'directory';
  readonly name: string;
}

interface FileSystemFileHandle extends FileSystemHandle {
  readonly kind: 'file';
  getFile(): Promise<File>;
  createWritable(): Promise<FileSystemWritableFileStream>;
  queryPermission(descriptor: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: string): Promise<void>;
  close(): Promise<void>;
}

// Check if the File System Access API is supported
const hasFileSystemAccessAPI = 'showOpenFilePicker' in window;

// Global state
let currentFileHandle: FileSystemFileHandle | null = null;

// DOM Elements
const openBtn = document.getElementById("openBtn") as HTMLButtonElement;
const textArea = document.getElementById("textArea") as HTMLTextAreaElement;
const saveBtn = document.getElementById("saveBtn") as HTMLButtonElement;
const saveAsBtn = document.getElementById("saveAsBtn") as HTMLButtonElement;
const statusDiv = document.getElementById("status") as HTMLDivElement;
const fileInfo = document.getElementById("fileInfo") as HTMLDivElement;
const filePathElement = document.getElementById("filePath") as HTMLSpanElement;

// Validate required elements
if (!openBtn || !textArea || !saveBtn || !saveAsBtn || !statusDiv || !fileInfo || !filePathElement) {
  console.error('Required elements not found');
  throw new Error('Required elements not found');
}

// Helper function to show status messages
function showStatus(message: string, isError: boolean = false): void {
  statusDiv.textContent = message;
  statusDiv.style.color = isError ? 'red' : 'green';
  statusDiv.style.marginBottom = '10px';
}

// Helper function to get file path
async function getFilePath(fileHandle: FileSystemFileHandle, file: File): Promise<string> {
  try {
    if ('queryPermission' in fileHandle) {
      const permission = await fileHandle.queryPermission({ mode: 'read' });
      if (permission === 'granted') {
        // Try to get the full path
        const newFile = await fileHandle.getFile();
        // Try different path properties that might be available
        const path = 'webkitRelativePath' in newFile ? newFile.webkitRelativePath : 
                    'path' in newFile ? (newFile as any).path : 
                    file.name;
        return path || file.name;
      }
    }
  } catch (err) {
    console.error('Error getting file path:', err);
  }
  return file.name;
}

// Helper function to update file info
async function updateFileInfo(fileHandle: FileSystemFileHandle, file: File): Promise<void> {
  try {
    fileInfo.style.display = 'block';
    const path = await getFilePath(fileHandle, file);
    filePathElement.textContent = path;
  } catch (err) {
    console.error('Error updating file info:', err);
    filePathElement.textContent = file.name;
  }
}

// Helper function to clear file info
function clearFileInfo(): void {
  fileInfo.style.display = 'none';
  filePathElement.textContent = 'No file opened';
}

// Helper function to save file content
async function saveFile(fileHandle: FileSystemFileHandle): Promise<void> {
  const writable = await fileHandle.createWritable();
  await writable.write(textArea.value);
  await writable.close();
  const file = await fileHandle.getFile();
  await updateFileInfo(fileHandle, file);
  showStatus('File saved successfully');
}

// Initialize UI based on API support
if (!hasFileSystemAccessAPI) {
  showStatus('Your browser does not support the File System Access API. Please use Chrome, Edge, or another Chromium-based browser.', true);
  openBtn.disabled = true;
  saveBtn.disabled = true;
  saveAsBtn.disabled = true;
}

// Event Handlers
openBtn.addEventListener("click", async () => {
  try {
    if (!hasFileSystemAccessAPI) {
      throw new Error('File System Access API not supported');
    }

    const [fileHandle] = await (window.showOpenFilePicker as any)();
    currentFileHandle = fileHandle;
    const file = await fileHandle.getFile();
    const text = await file.text();
    textArea.value = text;
    await updateFileInfo(fileHandle, file);
    showStatus(`Opened file: ${file.name}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    showStatus(`Error opening file: ${errorMessage}`, true);
    console.error('Error opening file:', err);
    clearFileInfo();
  }
});

saveBtn.addEventListener("click", async () => {
  try {
    if (!hasFileSystemAccessAPI) {
      throw new Error('File System Access API not supported');
    }

    let fileHandle: FileSystemFileHandle;
    if (!currentFileHandle) {
      // If no file is open, show save dialog
      fileHandle = await (window.showSaveFilePicker as any)({
        types: [{
          description: 'Text Files',
          accept: { 'text/plain': ['.txt'] },
        }],
      });
      currentFileHandle = fileHandle;
    } else {
      fileHandle = currentFileHandle;
    }
    
    await saveFile(fileHandle);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    showStatus(`Error saving file: ${errorMessage}`, true);
    console.error('Error saving file:', err);
  }
});

saveAsBtn.addEventListener("click", async () => {
  try {
    if (!hasFileSystemAccessAPI) {
      throw new Error('File System Access API not supported');
    }

    // Always show the save dialog for Save As
    const fileHandle = await (window.showSaveFilePicker as any)({
      suggestedName: currentFileHandle ? (await currentFileHandle.getFile()).name : 'untitled.txt',
      types: [{
        description: 'Text Files',
        accept: { 'text/plain': ['.txt'] },
      }],
    });

    // Save to the new location
    await saveFile(fileHandle);
    
    // Update the current file handle to the new location
    currentFileHandle = fileHandle;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    showStatus(`Error saving file: ${errorMessage}`, true);
    console.error('Error saving file:', err);
  }
}); 
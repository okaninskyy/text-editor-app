var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// Check if the File System Access API is supported
const hasFileSystemAccessAPI = 'showOpenFilePicker' in window;

let currentFileHandle = null;
const openBtn = document.getElementById("openBtn");
const textArea = document.getElementById("textArea");
const saveBtn = document.getElementById("saveBtn");
const saveAsBtn = document.getElementById("saveAsBtn");
const statusDiv = document.getElementById("status");
const fileInfo = document.getElementById("fileInfo");
const filePathElement = document.getElementById("filePath");

if (!openBtn || !textArea || !saveBtn || !saveAsBtn || !statusDiv || !fileInfo || !filePathElement) {
  console.error('Required elements not found');
  throw new Error('Required elements not found');
}

// Helper function to show status messages
function showStatus(message, isError = false) {
  statusDiv.textContent = message;
  statusDiv.style.color = isError ? 'red' : 'green';
  statusDiv.style.marginBottom = '10px';
}

// Helper function to get file path
async function getFilePath(fileHandle, file) {
  try {
    if (fileHandle.queryPermission) {
      const permission = await fileHandle.queryPermission({ mode: 'read' });
      if (permission === 'granted') {
        // Try to get the full path
        const path = await fileHandle.getFile().then(f => {
          // Try different path properties that might be available
          return f.webkitRelativePath || 
                 f.path || // Some browsers might support this
                 f.name; // Fallback to just the name
        });
        return path || file.name;
      }
    }
  } catch (err) {
    console.error('Error getting file path:', err);
  }
  return file.name;
}

// Helper function to update file info
async function updateFileInfo(fileHandle, file) {
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
function clearFileInfo() {
  fileInfo.style.display = 'none';
  filePathElement.textContent = 'No file opened';
}

// Helper function to save file content
async function saveFile(fileHandle) {
  const writable = await fileHandle.createWritable();
  await writable.write(textArea.value);
  await writable.close();
  const file = await fileHandle.getFile();
  await updateFileInfo(fileHandle, file);
  showStatus('File saved successfully');
}

if (!hasFileSystemAccessAPI) {
  showStatus('Your browser does not support the File System Access API. Please use Chrome, Edge, or another Chromium-based browser.', true);
  openBtn.disabled = true;
  saveBtn.disabled = true;
  saveAsBtn.disabled = true;
}

openBtn.addEventListener("click", async () => {
  try {
    if (!hasFileSystemAccessAPI) {
      throw new Error('File System Access API not supported');
    }

    const [fileHandle] = await window.showOpenFilePicker();
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

    if (!currentFileHandle) {
      // If no file is open, show save dialog
      currentFileHandle = await window.showSaveFilePicker({
        types: [{
          description: 'Text Files',
          accept: { 'text/plain': ['.txt'] },
        }],
      });
    }
    
    await saveFile(currentFileHandle);
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
    const fileHandle = await window.showSaveFilePicker({
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

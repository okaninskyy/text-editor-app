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
var hasFileSystemAccessAPI = 'showOpenFilePicker' in window;
// Global state
var currentFileHandle = null;
// DOM Elements
var openBtn = document.getElementById("openBtn");
var textArea = document.getElementById("textArea");
var saveBtn = document.getElementById("saveBtn");
var saveAsBtn = document.getElementById("saveAsBtn");
var statusDiv = document.getElementById("status");
var fileInfo = document.getElementById("fileInfo");
var filePathElement = document.getElementById("filePath");
// Validate required elements
if (!openBtn || !textArea || !saveBtn || !saveAsBtn || !statusDiv || !fileInfo || !filePathElement) {
    console.error('Required elements not found');
    throw new Error('Required elements not found');
}
// Helper function to show status messages
function showStatus(message, isError) {
    if (isError === void 0) { isError = false; }
    statusDiv.textContent = message;
    statusDiv.style.color = isError ? 'red' : 'green';
    statusDiv.style.marginBottom = '10px';
}
// Helper function to get file path
function getFilePath(fileHandle, file) {
    return __awaiter(this, void 0, void 0, function () {
        var permission, newFile, path, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!('queryPermission' in fileHandle)) return [3 /*break*/, 3];
                    return [4 /*yield*/, fileHandle.queryPermission({ mode: 'read' })];
                case 1:
                    permission = _a.sent();
                    if (!(permission === 'granted')) return [3 /*break*/, 3];
                    return [4 /*yield*/, fileHandle.getFile()];
                case 2:
                    newFile = _a.sent();
                    path = 'webkitRelativePath' in newFile ? newFile.webkitRelativePath :
                        'path' in newFile ? newFile.path :
                            file.name;
                    return [2 /*return*/, path || file.name];
                case 3: return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error('Error getting file path:', err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, file.name];
            }
        });
    });
}
// Helper function to update file info
function updateFileInfo(fileHandle, file) {
    return __awaiter(this, void 0, void 0, function () {
        var path, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    fileInfo.style.display = 'block';
                    return [4 /*yield*/, getFilePath(fileHandle, file)];
                case 1:
                    path = _a.sent();
                    filePathElement.textContent = path;
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    console.error('Error updating file info:', err_2);
                    filePathElement.textContent = file.name;
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Helper function to clear file info
function clearFileInfo() {
    fileInfo.style.display = 'none';
    filePathElement.textContent = 'No file opened';
}
// Helper function to save file content
function saveFile(fileHandle) {
    return __awaiter(this, void 0, void 0, function () {
        var writable, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fileHandle.createWritable()];
                case 1:
                    writable = _a.sent();
                    return [4 /*yield*/, writable.write(textArea.value)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, writable.close()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, fileHandle.getFile()];
                case 4:
                    file = _a.sent();
                    return [4 /*yield*/, updateFileInfo(fileHandle, file)];
                case 5:
                    _a.sent();
                    showStatus('File saved successfully');
                    return [2 /*return*/];
            }
        });
    });
}
// Initialize UI based on API support
if (!hasFileSystemAccessAPI) {
    showStatus('Your browser does not support the File System Access API. Please use Chrome, Edge, or another Chromium-based browser.', true);
    openBtn.disabled = true;
    saveBtn.disabled = true;
    saveAsBtn.disabled = true;
}
// Event Handlers
openBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
    var fileHandle, file, text, err_3, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!hasFileSystemAccessAPI) {
                    throw new Error('File System Access API not supported');
                }
                return [4 /*yield*/, window.showOpenFilePicker()];
            case 1:
                fileHandle = (_a.sent())[0];
                currentFileHandle = fileHandle;
                return [4 /*yield*/, fileHandle.getFile()];
            case 2:
                file = _a.sent();
                return [4 /*yield*/, file.text()];
            case 3:
                text = _a.sent();
                textArea.value = text;
                return [4 /*yield*/, updateFileInfo(fileHandle, file)];
            case 4:
                _a.sent();
                showStatus("Opened file: ".concat(file.name));
                return [3 /*break*/, 6];
            case 5:
                err_3 = _a.sent();
                errorMessage = err_3 instanceof Error ? err_3.message : 'Unknown error';
                showStatus("Error opening file: ".concat(errorMessage), true);
                console.error('Error opening file:', err_3);
                clearFileInfo();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
saveBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
    var err_4, errorMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!hasFileSystemAccessAPI) {
                    throw new Error('File System Access API not supported');
                }
                if (!!currentFileHandle) return [3 /*break*/, 2];
                return [4 /*yield*/, window.showSaveFilePicker({
                        types: [{
                                description: 'Text Files',
                                accept: { 'text/plain': ['.txt'] },
                            }],
                    })];
            case 1:
                // If no file is open, show save dialog
                currentFileHandle = (_a.sent());
                _a.label = 2;
            case 2: return [4 /*yield*/, saveFile(currentFileHandle)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_4 = _a.sent();
                errorMessage = err_4 instanceof Error ? err_4.message : 'Unknown error';
                showStatus("Error saving file: ".concat(errorMessage), true);
                console.error('Error saving file:', err_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
saveAsBtn.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
    var fileHandle, _a, _b, _c, err_5, errorMessage;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 6, , 7]);
                if (!hasFileSystemAccessAPI) {
                    throw new Error('File System Access API not supported');
                }
                _b = (_a = window).showSaveFilePicker;
                _d = {};
                if (!currentFileHandle) return [3 /*break*/, 2];
                return [4 /*yield*/, currentFileHandle.getFile()];
            case 1:
                _c = (_e.sent()).name;
                return [3 /*break*/, 3];
            case 2:
                _c = 'untitled.txt';
                _e.label = 3;
            case 3: return [4 /*yield*/, _b.apply(_a, [(_d.suggestedName = _c,
                        _d.types = [{
                                description: 'Text Files',
                                accept: { 'text/plain': ['.txt'] },
                            }],
                        _d)])];
            case 4:
                fileHandle = _e.sent();
                // Save to the new location
                return [4 /*yield*/, saveFile(fileHandle)];
            case 5:
                // Save to the new location
                _e.sent();
                // Update the current file handle to the new location
                currentFileHandle = fileHandle;
                return [3 /*break*/, 7];
            case 6:
                err_5 = _e.sent();
                errorMessage = err_5 instanceof Error ? err_5.message : 'Unknown error';
                showStatus("Error saving file: ".concat(errorMessage), true);
                console.error('Error saving file:', err_5);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });

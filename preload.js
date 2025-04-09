// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  runCommand: (code) => ipcRenderer.send('run-command', code),
  onCommandResult: (callback) => ipcRenderer.on('command-result', (_event, result) => callback(result))
});

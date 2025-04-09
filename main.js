const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
    }
  });

  win.loadFile('index.html');
}

ipcMain.on('run-command', (event, code) => {
    // Ici, tu pourrais exécuter du code ou le logguer
    const result = `Résultat simulé pour : ${code}`;
    event.reply('command-result', result);
  });

app.disableHardwareAcceleration();
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

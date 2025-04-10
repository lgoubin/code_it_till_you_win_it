const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // pour plus de sécurité
      contextIsolation: true
    }
  });

  win.loadURL("http://localhost:5173"); // Vite dev server
}

app.disableHardwareAcceleration();
app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

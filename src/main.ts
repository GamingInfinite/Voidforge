require("update-electron-app")();
import { app, BrowserWindow } from "electron";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
  });

  win.loadFile("./src/index.html");

  win.once("ready-to-show", () => {
    win.show();
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

require("update-electron-app")();
import { app, BrowserWindow } from "electron";

var win: BrowserWindow;
var settings: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
  });

  settings = new BrowserWindow({
    parent: win,
    modal: true,
    show: false,
  });

  win.loadFile("./src/index.html");
  settings.loadFile("./src/settings/settings.html");

  win.once("ready-to-show", () => {
    win.show();
  });

  settings.once("ready-to-show", () => {
    settings.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  console.log(app.getPath("userData"));
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

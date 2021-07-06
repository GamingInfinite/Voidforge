require("update-electron-app")();
import { app, BrowserWindow } from "electron";
import * as fs from "fs";
import * as path from "path";

var win: BrowserWindow;
var settings: BrowserWindow;

var settingsJson = {
  directory: "unset",
  instances: {},
};

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
  });

  // settings = new BrowserWindow({
  //   parent: win,
  //   modal: true,
  //   show: false,
  // });

  win.loadFile("./src/index.html");
  // settings.loadFile("./src/settings/settings.html");

  win.once("ready-to-show", () => {
    win.show();
  });

  // settings.once("ready-to-show", () => {
  //   settings.show();
  // });
}

function readSettings() {
  var rawSettingsJson = fs.readFileSync(
    path.join(app.getPath("userData"), "settings.json")
  );
  settingsJson = JSON.parse(rawSettingsJson.toString());
  console.log(settingsJson);
}

function writeSettings() {
  var data = JSON.stringify(settingsJson);
  fs.writeFileSync(path.join(app.getPath("userData"), "settings.json"), data);
}

app.whenReady().then(() => {
  createWindow();
  console.log(app.getPath("userData"));
  try {
    if (fs.existsSync(path.join(app.getPath("userData"), "settings.json"))) {
      console.log("Proceeding Normally");
    } else {
      console.log("Creating Initial Settings");
      writeSettings();
    }
  } catch (error) {
    console.log("Executing Order 66...");
  }
  readSettings();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

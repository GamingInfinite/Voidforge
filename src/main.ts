require("update-electron-app")();
import { app, BrowserWindow, ipcMain } from "electron";
import * as fs from "fs";
import * as path from "path";
import * as curseforge from "mc-curseforge-api";

var win: BrowserWindow;
var settings: BrowserWindow;

var pgSize = 10;
var version = ""
var pLength = 0;

var settingsJson = {
  directory: "unset",
  instances: {},
};

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("./src/index.html");

  win.once("ready-to-show", () => {
    win.show();
  });
}

function readSettings() {
  var rawSettingsJson = fs.readFileSync(
    path.join(app.getPath("userData"), "settings.json")
  );
  settingsJson = JSON.parse(rawSettingsJson.toString());
}

function writeSettings() {
  var data = JSON.stringify(settingsJson);
  fs.writeFileSync(path.join(app.getPath("userData"), "settings.json"), data);
}

app.whenReady().then(() => {
  createWindow();
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

ipcMain.on("openSettings", function (event, data) {
  var result = data;

  settings = new BrowserWindow({
    parent: win,
    modal: true,
    show: false,
  });

  settings.loadFile("./src/settings/settings.html");

  settings.once("ready-to-show", () => {
    settings.show();
  });

  event.sender.send("settingsOpen", result);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

function getPageSearch(pgNum: number, searchword: string) {
  curseforge
    .getMods({
      searchFilter: searchword,
      index: pgNum * pgSize,
      pageSize: pgSize,
      gameVersion: version,
    })
    .then((mods) => {
      var length = 0;
      for (let mod of Object.keys(mods)) {
        length++;
      }
      pLength = length;
      for (let index = 0; index < length; index++) {
        //@ts-ignore
        const mod = mods[index];
        if (mod.logo) {
          var packet = [
            mod.name,
            mod.authors[0].name,
            mod.summary,
            mod.logo.thumbnailUrl,
            mod.url,
          ];
          win.webContents.send("getPage", packet);
        } else {
          var packet = [
            mod.name,
            mod.authors[0].name,
            mod.summary,
            "./images/nothumb.png",
            mod.url,
          ];
          win.webContents.send("getPage", packet);
        }
      }
    });
}

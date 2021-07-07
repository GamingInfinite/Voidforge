require("update-electron-app")();
import { app, BrowserWindow, ipcMain } from "electron";
import * as fs from "fs";
import * as path from "path";
import * as curseforge from "mc-curseforge-api";

var win: BrowserWindow;
var settings: BrowserWindow;

var pgSize = 10;
var version = "";
var pLength = 0;
var pgNumber = 0;

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

ipcMain.on("requestPage", function (event, data) {
  if (data[1] == "first") {
    getPage(pgNumber, data[0], event);
  } else if (data[1] == "left") {
    if (pgNumber > 0) {
      pgNumber--;
      event.sender.send("updatePgNumber", pgNumber);
      getPage(pgNumber, data[0], event);
    }
  } else if (data[1] == "right") {
    if (pLength >= 10) {
      pgNumber++;
      event.sender.send("updatePgNumber", pgNumber);
      getPage(pgNumber, data[0], event);
    }
  }
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

function getPage(
  pgNum: number,
  searchword: string,
  event: Electron.IpcMainEvent
) {
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
      event.sender.send("clear");
      for (let index = 0; index < length; index++) {
        //@ts-ignore
        const mod = mods[index];
        console.log(mod);
        if (mod.logo) {
          var packet = [
            mod.name,
            mod.authors[0].name,
            mod.summary,
            mod.logo.thumbnailUrl,
            mod.url,
          ];
          event.sender.send("receivePage", packet);
        } else {
          var packet = [
            mod.name,
            mod.authors[0].name,
            mod.summary,
            "./images/nothumb.png",
            mod.url,
          ];
          event.sender.send("receivePage", packet);
        }
      }
    });
}

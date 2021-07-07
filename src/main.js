"use strict";
exports.__esModule = true;
require("update-electron-app")();
var electron_1 = require("electron");
var fs = require("fs");
var path = require("path");
var curseforge = require("mc-curseforge-api");
var win;
var settings;
var pgSize = 10;
var version = "";
var pLength = 0;
var pgNumber = 0;
var settingsJson = {
    directory: "unset",
    instances: {}
};
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadFile("./src/index.html");
    win.once("ready-to-show", function () {
        win.show();
    });
}
function readSettings() {
    var rawSettingsJson = fs.readFileSync(path.join(electron_1.app.getPath("userData"), "settings.json"));
    settingsJson = JSON.parse(rawSettingsJson.toString());
}
function writeSettings() {
    var data = JSON.stringify(settingsJson);
    fs.writeFileSync(path.join(electron_1.app.getPath("userData"), "settings.json"), data);
}
electron_1.app.whenReady().then(function () {
    createWindow();
    try {
        if (fs.existsSync(path.join(electron_1.app.getPath("userData"), "settings.json"))) {
            console.log("Proceeding Normally");
        }
        else {
            console.log("Creating Initial Settings");
            writeSettings();
        }
    }
    catch (error) {
        console.log("Executing Order 66...");
    }
    readSettings();
});
electron_1.ipcMain.on("openSettings", function (event, data) {
    var result = data;
    settings = new electron_1.BrowserWindow({
        parent: win,
        modal: true,
        show: false
    });
    settings.loadFile("./src/settings/settings.html");
    settings.once("ready-to-show", function () {
        settings.show();
    });
    event.sender.send("settingsOpen", result);
});
electron_1.ipcMain.on("requestPage", function (event, data) {
    if (data[1] == "first") {
        getPage(pgNumber, data[0], event);
    }
    else if (data[1] == "left") {
        if (pgNumber > 0) {
            pgNumber--;
            event.sender.send("updatePgNumber", pgNumber);
            getPage(pgNumber, data[0], event);
        }
    }
    else if (data[1] == "right") {
        if (pLength >= 10) {
            pgNumber++;
            event.sender.send("updatePgNumber", pgNumber);
            getPage(pgNumber, data[0], event);
        }
    }
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
function getPage(pgNum, searchword, event) {
    curseforge
        .getMods({
        searchFilter: searchword,
        index: pgNum * pgSize,
        pageSize: pgSize,
        gameVersion: version
    })
        .then(function (mods) {
        var length = 0;
        for (var _i = 0, _a = Object.keys(mods); _i < _a.length; _i++) {
            var mod = _a[_i];
            length++;
        }
        pLength = length;
        event.sender.send("clear");
        for (var index = 0; index < length; index++) {
            //@ts-ignore
            var mod = mods[index];
            if (mod.logo) {
                var packet = [
                    mod.name,
                    mod.authors[0].name,
                    mod.summary,
                    mod.logo.thumbnailUrl,
                    mod.url,
                ];
                event.sender.send("receivePage", packet);
            }
            else {
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

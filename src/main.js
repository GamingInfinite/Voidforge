"use strict";
exports.__esModule = true;
require("update-electron-app")();
var electron_1 = require("electron");
var fs = require("fs");
var path = require("path");
var win;
var settings;
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
    event.sender.send("actionReply", result);
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});

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
        show: false
    });
    // settings = new BrowserWindow({
    //   parent: win,
    //   modal: true,
    //   show: false,
    // });
    win.loadFile("./src/index.html");
    // settings.loadFile("./src/settings/settings.html");
    win.once("ready-to-show", function () {
        win.show();
    });
    // settings.once("ready-to-show", () => {
    //   settings.show();
    // });
}
function readSettings() {
    var rawSettingsJson = fs.readFileSync(path.join(electron_1.app.getPath("userData"), "settings.json"));
    settingsJson = JSON.parse(rawSettingsJson.toString());
    console.log(settingsJson);
}
function writeSettings() {
    var data = JSON.stringify(settingsJson);
    fs.writeFileSync(path.join(electron_1.app.getPath("userData"), "settings.json"), data);
}
electron_1.app.whenReady().then(function () {
    createWindow();
    console.log(electron_1.app.getPath("userData"));
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
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});

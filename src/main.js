"use strict";
exports.__esModule = true;
require("update-electron-app")();
var electron_1 = require("electron");
var win;
var settings;
function createWindow() {
    win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        show: false
    });
    settings = new electron_1.BrowserWindow({
        parent: win,
        modal: true,
        show: false
    });
    win.loadFile("./src/index.html");
    settings.loadFile("./src/settings/settings.html");
    win.once("ready-to-show", function () {
        win.show();
    });
    settings.once("ready-to-show", function () {
        settings.show();
    });
}
electron_1.app.whenReady().then(function () {
    createWindow();
    console.log(electron_1.app.getPath("userData"));
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});

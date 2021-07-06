"use strict";
exports.__esModule = true;
require("update-electron-app")();
var electron_1 = require("electron");
function createWindow() {
    var win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        show: false
    });
    win.loadFile("./src/index.html");
    win.once("ready-to-show", function () {
        win.show();
    });
}
electron_1.app.whenReady().then(function () {
    createWindow();
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});

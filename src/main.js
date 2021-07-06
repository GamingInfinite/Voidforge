"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
function createWindow() {
    var win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800
    });
    win.loadFile("./src/index.html");
}
electron_1.app.whenReady().then(function () {
    createWindow();
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});

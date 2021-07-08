"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require("update-electron-app")();
var electron_1 = require("electron");
var fs = require("fs");
var path = require("path");
var curseforge = require("mc-curseforge-api");
var win;
var settings;
var exec = require("child_process").execFile;
var pgSize = 10;
var version = "";
var pLength = 0;
var pgNumber = 0;
var settingsJson = {
    directory: "unset",
    instances: [
        { name: "Test Instance", modloader: "Fabric", version: "1.17.1" },
    ]
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
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    settings.loadFile("./src/settings/settings.html");
    settings.once("ready-to-show", function () {
        settings.show();
    });
    event.sender.send("settingsOpen", result);
});
electron_1.ipcMain.on("requestPage", function (event, data) {
    if (data[1] == "first") {
        pgNumber = 0;
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
electron_1.ipcMain.on("select-dir", function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, electron_1.dialog.showOpenDialog(settings, {
                    properties: ["openDirectory"]
                })];
            case 1:
                result = _a.sent();
                event.sender.send("recieveDir", result.filePaths[0]);
                settingsJson.directory = result.filePaths[0];
                writeSettings();
                return [2 /*return*/];
        }
    });
}); });
electron_1.ipcMain.on("requestIDir", function (event) {
    event.sender.send("instanceDir", settingsJson.directory);
});
function openMCLauncher() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, electron_1.dialog.showOpenDialog(win, {
                        properties: ["openFile"],
                        filters: [{ name: "Minecraft Launcher", extensions: ["exe"] }]
                    })];
                case 1:
                    result = _a.sent();
                    exec(result.filePaths[0]);
                    return [2 /*return*/];
            }
        });
    });
}

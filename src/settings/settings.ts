//@ts-ignore
const { ipcRenderer } = require("electron");

ipcRenderer.send("test", "test");
ipcRenderer.on("test", function (event, data) {
  console.log(data);
});

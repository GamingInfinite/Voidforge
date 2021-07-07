//@ts-ignore
const { ipcRenderer } = require("electron");

var dirSelector: HTMLInputElement
dirSelector = <HTMLInputElement>document.getElementById("instanceDir");

dirSelector.addEventListener("click", function () {
  ipcRenderer.send("select-dir");
});

if (dirSelector.value == "unset") {
    ipcRenderer.send("requestIDir")
    ipcRenderer.once("instanceDir", function(event, data) {
        if (data == "unset") {
            dirSelector.value = "Choose Directory..."
        } else {
            dirSelector.value = data;
        }
    })
}

ipcRenderer.on("recieveDir", function(event, data) {
    dirSelector.value = data;
})

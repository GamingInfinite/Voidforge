var ipcRenderer = require('electron').ipcRenderer;
var settingsBtn = document.getElementById("settingsBtn");
settingsBtn.addEventListener("click", function () {
    ipcRenderer.once("actionReply", function (event, response) {
        console.log(response);
    });
    ipcRenderer.send("openSettings", "some data");
});

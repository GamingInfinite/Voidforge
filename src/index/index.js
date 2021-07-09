//@ts-ignore
var ipcRenderer = require("electron").ipcRenderer;
var settingsBtn = document.getElementById("settingsBtn");
var leftButton = document.getElementById("prevPage");
var rightButton = document.getElementById("nextPage");
var searchButton = document.getElementById("searchButton");
var searchInput = document.getElementById("searchInput");
var pgDisplay = document.getElementById("pgNumber");
var lastArgs = "";
var pgNumber = 0;
settingsBtn.addEventListener("click", function () {
    ipcRenderer.once("settingsOpen", function (event, response) {
        console.log(response);
    });
    ipcRenderer.send("openSettings", "some data");
});
leftButton.addEventListener("click", function () {
    ipcRenderer.send("requestPage", [lastArgs, "left"]);
});
rightButton.addEventListener("click", function () {
    ipcRenderer.send("requestPage", [lastArgs, "right"]);
});
searchButton.addEventListener("click", function () {
    lastArgs = searchInput.value;
    ipcRenderer.send("requestPage", [lastArgs, "first"]);
});
ipcRenderer.on("receivePage", function (event, packet) {
    var modName = packet[0];
    var modAuth = packet[1];
    var modSum = packet[2];
    var modLogo = packet[3];
    var modPageUrl = packet[4];
    var mods = document.getElementById("mods");
    var cardContainer = createElement("div", ["class"], ["col bg-dark mod"]);
    var card = createElement("div", ["class"], ["card rounded-5"]);
    var cardImage = createElement("img", ["class", "src", "alt"], ["card-img-top", modLogo, "..."]);
    card.appendChild(cardImage);
    var cardBody = createElement("div", ["class"], ["card-body"]);
    var cardTitle = createElement("h5", ["class"], ["card-title"], modName);
    var cardSubtitle = createElement("h6", ["class"], ["card-subtitle mb-2 text-muted"], modAuth);
    var cardText = createElement("p", [], [], modSum);
    var modPage = createElement("a", ["href", "class", "target"], [modPageUrl, "btn btn-primary", "_blank"], "Mod Page");
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardSubtitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(modPage);
    card.appendChild(cardBody);
    cardContainer.appendChild(card);
    mods.appendChild(cardContainer);
});
ipcRenderer.on("clear", function (event) {
    clearMods();
});
function clearMods() {
    var modList = document.getElementsByClassName("mod");
    while (modList.length > 0) {
        modList[0].remove();
    }
}
//@ts-ignore
function createElement(eType, attributes, attValues, inlineText) {
    var element = document.createElement(eType);
    for (var index = 0; index < attributes.length; index++) {
        var attr = attributes[index];
        var attribute = document.createAttribute(attr);
        attribute.value = attValues[index];
        element.setAttributeNode(attribute);
    }
    if (inlineText != null) {
        element.textContent = inlineText;
    }
    return element;
}
ipcRenderer.on("updatePgNumber", function (event, data) {
    pgNumber = data;
    update();
});
function update() {
    pgDisplay.innerHTML = (pgNumber + 1).toString();
}
ipcRenderer.send("requestPage", [lastArgs, "first"]);

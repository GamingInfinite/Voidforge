const { ipcRenderer } = require("electron");

var settingsBtn = document.getElementById("settingsBtn");
var leftButton = document.getElementById("prevPage");
var rightButton = document.getElementById("nextPage");
var searchButton = document.getElementById("searchButton");
var searchInput = document.getElementById("searchInput");
var pgDisplay = document.getElementById("pgNumber");

var pgNumber = 0;

settingsBtn.addEventListener("click", function () {
  ipcRenderer.once("settingsOpen", function (event, response) {
    console.log(response);
  });
  ipcRenderer.send("openSettings", "some data");
});

leftButton.addEventListener("click", function () {});

ipcRenderer.on("getPage", function (event, packet) {});

function clearMods() {
  var modList = document.getElementsByClassName("mod");
  while (modList.length > 0) {
    modList[0].remove();
  }
}

function createElement(
  eType: string,
  attributes: string[],
  attValues: any[],
  inlineText?: string
): any {
  var element = document.createElement(eType);
  for (let index = 0; index < attributes.length; index++) {
    const attr = attributes[index];
    var attribute = document.createAttribute(attr);
    attribute.value = attValues[index];
    element.setAttributeNode(attribute);
  }
  if (inlineText != null) {
    element.textContent = inlineText;
  }
  return element;
}

function update() {
  pgDisplay.innerHTML = "" + pgNumber + 1;
}

//@ts-ignore
const { ipcRenderer } = require("electron");

var dirSelector: HTMLInputElement;
dirSelector = <HTMLInputElement>document.getElementById("instanceDir");
var modloaderSelect: HTMLSelectElement;
modloaderSelect = <HTMLSelectElement>document.getElementById("modloaderSelect");

var versionList = [
  "1.17.1",
  "1.17",
  "1.16.5",
  "1.16.4",
  "1.16.3",
  "1.16.2",
  "1.16.1",
  "1.16",
  "1.15.2",
  "1.15.1",
  "1.15",
  "1.14.4",
  "1.14.3",
  "1.14.2",
  "1.14.1",
  "1.14",
  "1.13.2",
  "1.12.2",
  "1.12.1",
  "1.12",
  "1.11.2",
  "1.11",
  "1.10.2",
  "1.10",
  "1.9.4",
  "1.9",
  "1.8.9",
  "1.8.8",
  "1.7.10",
  "1.7.2",
  "1.6.4",
  "1.6.2",
  "1.6.1",
  "1.5.2",
  "1.5.1",
  "1.4.7",
  "1.4.6",
  "1.4.5",
  "1.4.4",
  "1.4.2",
  "1.3.2",
  "1.2.5",
  "1.2.4",
  "1.2.3",
  "1.1",
];

dirSelector.addEventListener("click", function () {
  ipcRenderer.send("select-dir");
});

if (dirSelector.value == "unset") {
  ipcRenderer.send("requestIDir");
  ipcRenderer.once("instanceDir", function (event, data) {
    if (data == "unset") {
      dirSelector.value = "Choose Directory...";
    } else {
      dirSelector.value = data;
    }
  });
}

function selectModLoader() {
  if (modloaderSelect.value == "1") {
  }
}

ipcRenderer.on("recieveDir", function (event, data) {
  dirSelector.value = data;
});

var versionSelector = document.getElementById("versionSelect");

for (let index = 0; index < versionList.length; index++) {
  var option = createElement(
    "option",
    ["value"],
    [index.toString()],
    versionList[index]
  );
  versionSelector.appendChild(option);
}

//@ts-ignore
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

var instanceSelector = document.getElementById("instanceSelector");

function reload() {
  clearInstances();
  ipcRenderer.send("requestInstances");
}

ipcRenderer.on("receiveInstances", function (event, data) {
  if (data != "none") {
    var opt: HTMLOptionElement = createElement(
      "option",
      ["value", "class"],
      [data[3], "instance"],
      data[0]
    );
    var modloaderBadge = createElement(
      "span",
      ["class"],
      ["badge bg-primary"],
      data[1]
    );
    var versionBadge = createElement(
      "span",
      ["class"],
      ["badge bg-secondary"],
      data[2]
    );
    opt.appendChild(modloaderBadge);
    opt.appendChild(versionBadge);
    instanceSelector.appendChild(opt);
  }
});

function clearInstances() {
  var instances = document.getElementsByClassName("instance");
  while (instances.length > 0) {
    instances[0].remove();
  }
}

reload();

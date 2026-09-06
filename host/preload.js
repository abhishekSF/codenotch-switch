const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("codenotchOverlay", {
  reportMask(report) {
    ipcRenderer.send("overlay:mask", report);
  },
  setPointerOverChrome(over) {
    ipcRenderer.send("overlay:hover", Boolean(over));
  },
});

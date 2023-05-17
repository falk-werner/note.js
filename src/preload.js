const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('note', {
    list: () => ipcRenderer.invoke('listNotes'),
    read: (name) => ipcRenderer.invoke('readNote', name)
});

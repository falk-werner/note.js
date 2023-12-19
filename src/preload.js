const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('note', {
    list: () => ipcRenderer.invoke('listNotes'),
    read: (name) => ipcRenderer.invoke('readNote', name),
    create: () => ipcRenderer.invoke('createNote'),
    rename: (old_name, new_name) => ipcRenderer.invoke('renameNote', old_name, new_name),
    write: (name, contents) => ipcRenderer.invoke('writeNote', name, contents),
    remove: (name) => ipcRenderer.invoke('removeNote', name),
    read_tags: (name) => ipcRenderer.invoke('readTags', name),
    write_tags: (name, tags) => ipcRenderer.invoke('writeTags', name, tags)
});

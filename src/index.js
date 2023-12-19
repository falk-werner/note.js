const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const path = require('path');
const note = require('./backend/note');
const { Config } = require("./backend/config");

const config = new Config();

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

app.on('ready', () => {
  protocol.registerFileProtocol('local', (req, callback) => {
    const relative_path = req.url.substring('local://'.length);
    const full_path = path.resolve(`${config.base_path}/${relative_path}`);
    if (full_path.startsWith(config.base_path)) {
      callback({ path: full_path});
    }
    else {
      console.warn(`prevented possible path traversal: ${full_path}`);
      callback({statusCode: 404});
    }
  });
  ipcMain.handle('listNotes', note.list);
  ipcMain.handle('readNote', note.read);
  ipcMain.handle('createNote', note.create);
  ipcMain.handle('renameNote', note.rename);
  ipcMain.handle('writeNote', note.write);
  ipcMain.handle('removeNote', note.remove);
  ipcMain.handle('readTags', note.read_tags);
  ipcMain.handle('writeTags', note.write_tags);
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

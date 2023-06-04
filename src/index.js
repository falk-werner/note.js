const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const note = require('./backend/note');

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
  ipcMain.handle('listNotes', note.list);
  ipcMain.handle('readNote', note.read);
  ipcMain.handle('createNote', note.create);
  ipcMain.handle('renameNote', note.rename);
  ipcMain.handle('writeNote', note.write);
  ipcMain.handle('removeNote', note.remove);
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

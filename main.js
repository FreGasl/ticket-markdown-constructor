const { app, BrowserWindow, ipcMain } = require('electron/main');
const { createConstructorWindow, createMainWindow, createSettingWindow} = require("./utils/windows");
const settings = require('./settings.json');
const fs = require("fs");
const path = require("node:path");

if (settings.screenSize === undefined) {
    settings.screenSize = 'Маленький';
    fs.writeFile(path.join(__dirname, './settings.json'), JSON.stringify(settings), function (err) {
        if (err) {
            alert("An error ocurred updating the file" + err.message);
        }
    });
}

let mainWindow;

ipcMain.on("openSettingsWindow", () => {
    createSettingWindow(mainWindow);
});

app.whenReady().then(() => {
    mainWindow = createConstructorWindow(settings.screenSize === 'На весь экран');

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createConstructorWindow(settings.screenSize === 'На весь экран');
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

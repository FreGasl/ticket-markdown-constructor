const { BrowserWindow, shell, ipcMain } = require('electron/main');
const path = require("node:path");

const createConstructorWindow = function (fullScreen) {
    let window;
    let loading = new BrowserWindow({ show: false, frame: false, width: 600, height: 600 });
    loading.once('show', () => {
        console.log(path.join(__dirname, '../pages/preload/preload-form.js'))
        window = new BrowserWindow({
            width: 700,
            height: 700,
            autoHideMenuBar: true,
            show: false,
            webPreferences: {
                preload: path.join(__dirname, '../pages/preload/preload-form.js'),
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
            },
        });
        window.webContents.once('dom-ready', () => {
            setTimeout(() => {
                loading.hide();
                loading.close();
                window.show();
                if (fullScreen) window.maximize();
            }, 2000);
        });
        window.webContents.setWindowOpenHandler(({ url }) => {
            if (url.startsWith('http:')) {
                shell.openExternal(url);
            }
            return { action: 'deny' };
        });
        window.loadFile("./pages/form.html");
    });
    loading.loadFile('./pages/loading.html');
    loading.show();

    ipcMain.on('update-page', () => {
        window.webContents.reload();
    });

    return window
}

const createSettingWindow = function (mainWindow) {
    const window = new BrowserWindow({
        parent: mainWindow,
        width: 500,
        height: 500,
        modal: true,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, '../pages/preload/preload-settings.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    window.loadFile("./pages/settings.html");
    window.once("ready-to-show", () => {
        window.show();
    });
}

module.exports = { createConstructorWindow, createSettingWindow }

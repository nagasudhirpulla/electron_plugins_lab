import { app, BrowserWindow, OpenDialogOptions } from 'electron';
// import url from "url";
import path from "path";
import { ipcMain } from 'electron';
import { spawn, ChildProcess } from "child_process";
// import { join } from 'path';
const showOpenDialog = require('electron').dialog.showOpenDialog;


let win: BrowserWindow;

const createWindow = () => {
    win = new BrowserWindow({
        width: 1340,
        height: 750,
        webPreferences: {
            nodeIntegration: true, webSecurity: false
        }
    });
    win.loadURL(`file://${path.resolve(path.dirname(process.mainModule.filename), 'index.html')}`);
    win.on("closed", () => {
        win = null;
    });
};

const onAppReady = async () => {
    // createWindow();
    const opt: OpenDialogOptions = { properties: ['openDirectory'] };
    showOpenDialog(opt, (val) => {
        console.log(val);
    });
};

app.on("ready", onAppReady);
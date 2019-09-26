import { app, BrowserWindow, OpenDialogOptions } from 'electron';
// import url from "url";
import { ipcMain } from 'electron';
import { spawn, ChildProcess } from "child_process";
import path from 'path';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFileAsync } from './fileUtils';
import { AdapterManifest } from './def_manifest';
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

const getExesFolder = ():string=>{
    return path.resolve(path.dirname(process.mainModule.filename), 'adapters')
}

const onAppReady = async () => {
    // createWindow();
    // const opt: OpenDialogOptions = { properties: ['openDirectory'] };
    // showOpenDialog(opt, (folNames) => {
    //     console.log(`selected folders = ${folNames}`);
    //     if (folNames.length == 0) {
    //         return;
    //     }
    //     const selectedFolder = folNames[0];
    // });

    const dialogRes = await showOpenDialog({
        properties: ['openDirectory'],
        title: 'Open Dashboard File'
    }) as any;
    let openFoldName: string = null;
    console.log(dialogRes);
    if (dialogRes.canceled == true) {
        return;
    }
    else if (dialogRes.filePaths.length == 0) {
        return;
    }
    else {
        openFoldName = dialogRes.filePaths[0];
    }
    console.log(openFoldName);
    // check if manifest file exists
    const manifestPath = join(openFoldName, 'manifest.json');
    if (!existsSync(manifestPath)) {
        console.log('manifest file not present');
        return;
    }
    // read the manifest JSON from file
    let manifestJson = JSON.parse(await readFileAsync(manifestPath) as string) as any as AdapterManifest;
    console.log(manifestJson);

    // ensure manifest json attributes
    let absentAttrs: string[] = []
    if (manifestJson.app_id == undefined) {
        absentAttrs.push('app_id');
    }
    if (manifestJson.entry == undefined) {
        absentAttrs.push('entry');
    }
    if (manifestJson.name == undefined) {
        absentAttrs.push('name');
    }
    if (manifestJson.is_meas_picker_present == undefined) {
        absentAttrs.push('is_meas_picker_present');
    }
    if (manifestJson.is_adapter_config_ui_present == undefined) {
        absentAttrs.push('is_adapter_config_ui_present');
    }
    if (absentAttrs.length > 0) {
        console.log(`${absentAttrs.join(', ')} are absent in manifest json file`);
        return;
    }

    const pluginFolderPath = join(getExesFolder(), manifestJson.app_id);
    console.log(`plugin folder path = ${pluginFolderPath}`);
    // check if pluginFolderPath exists already in the adapter exes Location
    if (existsSync(pluginFolderPath)) {
        console.log('pluginFolderPath already present');
    }
};

app.on("ready", onAppReady);
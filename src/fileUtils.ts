import { readFile, writeFile, stat } from 'fs';
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');
var rimraf = require("rimraf");

export const readFileAsync = function (filename: string) {
    return new Promise(function (resolve, reject) {
        readFile(filename, function (err, data) {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
};

export const writeFileAsync = function (filename: string, contents: string): Promise<boolean> {
    return new Promise(function (resolve, reject) {
        writeFile(filename, contents, function (err) {
            if (err)
                reject(err);
            else
                resolve(true);
        });
    });
};


export const ensureFolderAsync = function (folderName: string): Promise<boolean> {
    return new Promise(function (resolve, reject) {
        mkdirp(folderName, function (err: any) {
            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });
};


export const copyFolderAsync = function (srcFolderName: string, destFolderName: string): Promise<boolean> {
    ncp.limit = 16;
    return new Promise(function (resolve, reject) {
        ncp(srcFolderName, destFolderName, function (err: any) {
            if (err) {
                return reject(err);
            }
            resolve(true);
        });
    });
};

export const removeFolderAsync = function (folderPath: string): Promise<boolean> {
    return new Promise(function (resolve, reject) {
        stat(folderPath, function (err) {
            if (!err) {
                console.log('file or directory exists');
                rimraf(folderPath, function (err: any) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    console.log(`Successfully deleted folder ${folderPath}`);
                    resolve(true);
                });
            }
            else if (err.code === 'ENOENT') {
                // console.log('file or directory does not exist');
                resolve(true);
            }
        });
    });
}


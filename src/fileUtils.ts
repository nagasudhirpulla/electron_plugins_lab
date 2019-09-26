import { readFile, writeFile } from 'fs';

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
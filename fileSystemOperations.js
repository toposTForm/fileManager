import * as fs from 'fs';
import { User } from './index.js';
import path from 'path';
import { createReadStream, createWriteStream } from "fs";
import { error } from 'console';
import { Transform } from "node:stream";

const upDir = function upDir() {
    path.parse(User.curDIr).base == '' ? console.log(`\x1b[31m%s\x1b[0m`, 'You are alredy on Root Dir!') : User.curDIr = path.dirname(User.curDIr);
    return path.normalize(User.curDIr);
}
const cdDir = async function cdDir(dirPath) {
    try {
        if (!path.isAbsolute(dirPath)){
            dirPath = path.resolve(User.curDIr, dirPath);
        }
        let checkDir = await fs.promises.opendir(dirPath);
        for await (let dirent of checkDir){
            User.curDIr = dirPath;
            return dirent.path;
        }
    } catch (error) {
        console.error(error);
        console.log(`\x1b[31m%s\x1b[0m`, 'Directory path is not correct or coud not be open!');   
        return User.curDIr;
    }
}
const lsDir = async function lsDir() {
    let dirPath = User.curDIr;
    let files = [];
    let dirs = [];
    let resultArr = [];
    try {
        let checkDir = await fs.promises.readdir(dirPath, { withFileTypes: true });
        for await (let dirent of checkDir){
            if (dirent.isFile()){
                if (dirent.name.length > 20) dirent.name = dirent.name.substring(0, 30) + '...';
                files.push({name: dirent.name, type: 'file'});
            } else if (dirent.isDirectory()){
                if (dirent.name.length > 20) dirent.name = dirent.name.substring(0, 30) + '...';
                dirs.push({name: dirent.name, type: 'directory'});
            }
        }
        dirs = dirs.sort((a, b) => a.name.localeCompare(b.name, 'en', { ignorePunctuation: true }));
        files = files.sort((a, b) => a.name.localeCompare(b.name, 'en', { ignorePunctuation: true }));
        resultArr = dirs.concat(files);
        return resultArr;
    } catch (error) {
        console.error(error);
        console.log(`\x1b[31m%s\x1b[0m`, 'Directory path is not correct or coud not be open!');
        return error;   
    }
};

const catDir = function catDir(filePath) {
    return new Promise((resolve, reject) => {
        try {
            let input = '';
            if (!path.isAbsolute(filePath)){
                input = createReadStream(path.resolve(User.curDIr, filePath));
            } else {
                input = createReadStream(filePath);
            };
            input.on('readable', () => {
                const data = input.read();
                if (data){
                    resolve(data.toString());
                };
            });
            input.on('error', (error) => {
                console.log(`\x1b[31m%s\x1b[0m`, 'File path is not correct or coud not be open!');
                console.error(error);
            });
        } catch (error) {
            console.error(error);
            console.log(`\x1b[31m%s\x1b[0m`, 'File path is not correct or coud not be open!');
        };
    });
};

const addDir = async function addDir(filePath) {
        try {
            if (!path.isAbsolute(filePath)){
                filePath = path.resolve(User.curDIr, filePath);
            };
            await fs.promises.appendFile(filePath, '', err => {
                if (err){
                    console.log(err)
                };
            });
            return filePath;
        } catch (error) {
            console.error(error);
            console.log(`\x1b[31m%s\x1b[0m`, 'File could not be created!');
        };
};

const mkdirDir = async function mkdirDir(dirPath){
    try {
        if (!path.isAbsolute(dirPath)){
            dirPath = path.resolve(User.curDIr, dirPath);
        }
        await fs.promises.mkdir(dirPath,  err => {
            if (err){
                console.log(err)
            };
        });
        return dirPath;
    } catch (error) {
        console.error(error);
        console.log(`\x1b[31m%s\x1b[0m`, 'Directory could not be created!');
    };
};

const rnDir = async function rnDir(filePath) {
    try {
        let newFilePath = filePath.split(' ')[1];
        let oldFilePath = filePath.split(' ')[0];
        let oldFileExt = path.parse(oldFilePath).ext;
        let oldFileName;
        let newFileName = path.parse(newFilePath).name;
        let fileDir;
        if (!path.isAbsolute(oldFilePath)){
            oldFilePath = path.resolve(User.curDIr, oldFilePath);
        }
        if (!path.isAbsolute(filePath)){
            filePath = filePath.split(' ')[0];
            filePath = path.resolve(User.curDIr, filePath);
            filePath = path.parse(filePath);
            oldFileName = filePath.base;
            fileDir = filePath.dir;
            filePath = filePath.dir + '\\' + newFileName + oldFileExt;
        }else {
            filePath = filePath.split(' ')[0];
            filePath = path.parse(filePath);
            oldFileName = filePath.base;
            fileDir = filePath.dir;
            filePath = filePath.dir + '\\' + newFileName + oldFileExt;
        }
        let checkFile = (await fs.promises.readdir(fileDir)).filter((file) => file == oldFileName);
        if (checkFile.length !== 0){
            if (newFileName !== undefined){
                let bla = await fs.promises.rename(oldFilePath, filePath);
                return filePath;
            }
        } else{
            throw new Error(`File ${oldFilePath} not found!`)
        }
    } catch (error) {
        console.error(error);
        console.log(`\x1b[31m%s\x1b[0m`, 'Directory of file could not be renamed!');
    }
};

const cpDir = async function cpDir (pathPath){
    try {
        let input;
        let output;
        let oldFileName;
        let fileToCopy = pathPath.split(' ')[0];
        oldFileName = path.parse(fileToCopy).base;
        let newFile = pathPath.split(' ')[1];
        let newFileName = path.parse(newFile).base;
        let newDIr = path.parse(newFile).dir;
        if (!path.isAbsolute(fileToCopy)){
            fileToCopy = path.resolve(User.curDIr, fileToCopy);
        };
        if (!path.isAbsolute(newFile)){
            newFile = path.resolve(User.curDIr, newFile);
            newDIr = path.parse(newFile).dir;
        };
        let checkFile = (await fs.promises.readdir(newDIr)).filter((file) => file == newFileName);
        if (checkFile.length == 0){
            input = createReadStream(fileToCopy);
            input.on('error', (error) => {
                console.log(`\x1b[31m%s\x1b[0m`, 'File To Copy could not be copied!');
                console.error(error);
            });
            output = createWriteStream(newFile);
            input.pipe(output);
            output.on('finish', () => {
            });
            return newFile;
        }else {
            throw new Error(`File ${newFile} already exist!`)
        };
    } catch (error) {
        console.error(error);
        console.log(`\x1b[31m%s\x1b[0m`, 'Directory of file could not be copied!');
    };
};

const mvDir = async function mvDir (pathPath){
    try {
        let input;
        let output;
        let oldFileName;
        let newDir;
        let fileToMove = pathPath.split(' ')[0];
        oldFileName = path.parse(fileToMove).base;
        let newFile = pathPath.split(' ')[1];
        if (!path.isAbsolute(fileToMove)){
            fileToMove = path.resolve(User.curDIr, fileToMove);
        }
        if (!path.isAbsolute(newFile)){
            newFile = path.resolve(User.curDIr, newFile);
            newDir = path.parse(newFile).dir;
        }
        let checkDir = (await fs.promises.readdir(newFile)).filter((file) => file == oldFileName);
        if (checkDir.length == 0){
            input = createReadStream(fileToMove);
            input.on('error', (error) => {
                console.log(`\x1b[31m%s\x1b[0m`, 'File To Copy could not be copied!');
                console.error(error);
            });
            output = createWriteStream(newFile + '\\' + oldFileName);
            input.pipe(output);
            output.on('finish', () => {
                function rmcallback(err){
                    if (err) throw new Error('Old file could not be deleted!');
                };
                fs.promises.rm(fileToMove, { recursive: false }, rmcallback);
            });
            return newFile;
        }else {
            throw new Error(`File ${newFile} already exist!`)
        }
    } catch (error) {
        console.error(error);
    }
}

const rmDir = async function rmDir(deletePath){
    try {
        let deleteItem = path.parse(deletePath).base;
        let deleteItemExt = path.parse(deletePath).ext;
        let deleteDir = path.parse(deletePath).dir;
        if (!path.isAbsolute(deletePath)){
            deletePath = path.resolve(User.curDIr, deletePath);
            if (deleteItemExt == ''){
                deleteDir = path.parse(deletePath).dir;
            }else{
                deleteDir = path.parse(deletePath).dir;
            }
        }
        let checkDir;
        if (deleteItemExt ==''){
           checkDir = (await fs.promises.readdir(deleteDir)).filter((folder) => folder == deleteItem);
        } else{
            checkDir = (await fs.promises.readdir(deleteDir)).filter((file) => file == deleteItem);
        }   
        if (checkDir.length == 1 && deleteItemExt == ''){
            function rmDirCallback(err){
                if (err) throw new Error('File could not be deleted!');
            };
            fs.promises.rm(deletePath, { recursive: true }, rmDirCallback);
        } else if (checkDir.length == 1 && deleteItemExt !== ''){
            function rmFilecallback(err){
                if (err) throw new Error('Folder could not be deleted!');
            };
            fs.promises.rm(deletePath, { recursive: false }, rmFilecallback);
        } else {
            throw new Error(`${newFile} is not exist!`)
        }
        return deletePath;
    } catch (error) {
        console.error(error);
    }
 
}
export {
    upDir,
    cdDir,
    lsDir,
    catDir,
    addDir,
    mkdirDir,
    rnDir,
    cpDir,
    mvDir,
    rmDir,
}



import { createReadStream, createWriteStream } from "fs";
import { createBrotliCompress, createBrotliDecompress } from "zlib";
import path from "path";
import { User } from "./index.js";

const compress = async function (filePath)  {
    return new Promise((resolve, reject) => {
        try {
            let inputPath = filePath.split(' ')[0];
            let inputStream;
            let zipTransform = createBrotliCompress('utf-8');
            let destinationFile;
            let outputStream;
            if (!path.isAbsolute(inputPath)){
                inputStream = createReadStream(path.resolve(User.curDIr, inputPath));
            } else {
                inputStream = createReadStream(inputPath);
            }
            if (filePath.split(' ').length == 2){
                destinationFile = path.parse(filePath.split(' ')[1]);
                if (!path.isAbsolute(path.format(destinationFile))){
                    destinationFile = path.parse(path.resolve(User.curDIr, path.format(destinationFile)));
                    if (destinationFile.ext == ''){
                        destinationFile.name = path.parse(filePath.split(' ')[0]).name + '_brothli_archive'; 
                        destinationFile.ext = path.parse(filePath.split(' ')[0]).ext; 
                        if (path.parse(path.format(destinationFile)).ext == ''){
                            outputStream = createWriteStream(path.normalize(path.format(destinationFile)) + '\\' +  destinationFile.name + destinationFile.ext);
                        }else{
                            outputStream = createWriteStream(path.normalize(path.format(destinationFile)));
                        }
                    } else {
                        outputStream = createWriteStream(path.normalize(path.format(destinationFile)));
                    }
                } else {
                    destinationFile.base = '';
                    outputStream = createWriteStream(path.normalize(path.format(destinationFile)) );
                }
            }else {
                destinationFile = path.parse(filePath);
                destinationFile.name += '_brothli_archive';
                destinationFile.ext = path.parse(filePath.split(' ')[0]).ext; 
                destinationFile.base = '';
                outputStream = createWriteStream(path.normalize(path.format(destinationFile)) );
            }
            inputStream.pipe(zipTransform).pipe(outputStream);
            inputStream.on('error', (err) => {
                console.log(`\x1b[31m%s\x1b[0m`, `Archive operation fail with file ${filePath}`);
                console.log(err);
                reject(err);
            })
            outputStream.on('finish', () => {
                resolve(true);
                if (destinationFile.ext == ''){
                    console.log('\x1b[33m%s\x1b[0m', `${inputPath} archived to ${path.normalize(path.format(destinationFile)) + '\\' + destinationFile.name + destinationFile.ext}`);
                } else {
                    console.log('\x1b[33m%s\x1b[0m', `${inputPath} archived to ${path.normalize(path.format(destinationFile))}`);
                }
            });
        } catch (error) {
            console.error(`\x1b[31m%s\x1b[0m`, error);
        }
    })
};

const decompress = async function decompress(filepath) {  
    return new Promise((resolve, reject) => {
        try {
            let inputPath = filepath.split(' ')[0];
            let destinationFile;
            let outputStream;
            let inputStream;
            let zipTransform = createBrotliDecompress('utf-8');
            if (!path.isAbsolute(inputPath)){
                inputStream = createReadStream(path.resolve(User.curDIr, inputPath));
            } else {
                inputStream = createReadStream(inputPath);
            }
            if (filepath.split(' ').length == 2){
                destinationFile = path.parse(filepath.split(' ')[1]);
                if (!path.isAbsolute(path.format(destinationFile))){
                    destinationFile = path.parse(path.resolve(User.curDIr, path.format(destinationFile)));
                    if (destinationFile.ext == ''){
                        destinationFile.name = path.parse(filepath.split(' ')[0]).name; 
                        destinationFile.ext = path.parse(filepath.split(' ')[0]).ext; 
                        if (path.parse(path.format(destinationFile)).ext == ''){
                            outputStream = createWriteStream(path.normalize(path.format(destinationFile)) + '\\' +  destinationFile.name + destinationFile.ext);
                        }else{
                            outputStream = createWriteStream(path.normalize(path.format(destinationFile)));
                        }
                    }else{
                        outputStream = createWriteStream(path.normalize(path.format(destinationFile)));
                    }
                } else {
                    outputStream = createWriteStream(path.normalize(path.format(destinationFile)) );
                }
            }else {
                destinationFile = path.parse(filepath);
                destinationFile.name = destinationFile.name.replace(/_brothli_archive/i, '');
                outputStream = createWriteStream(`${path.normalize(path.format(destinationFile))}`);
            }
            destinationFile.base = '';
            inputStream.pipe(zipTransform).pipe(outputStream);
            inputStream.on('error', (err) => {
                console.log(err);
                reject(err);
            })
            outputStream.on('finish', () => {
                resolve(true);
                console.log('\x1b[33m%s\x1b[0m', `${filepath} unarchived to ${path.normalize(path.format(destinationFile))}`);
            });
        } catch (error) {
            console.error(`\x1b[31m%s\x1b[0m`, error);
        }
    });
};

export {
    compress,
    decompress
}
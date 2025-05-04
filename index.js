import  scripts  from './package.json' with {type: 'json'};
import process from "node:process";
import { argv } from "node:process";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { EOL, userInfo } from 'node:os';
import { cpus } from 'node:os';
import { calculateHash } from './hash.js';
import { compress ,decompress } from './archiveOperations.js';
import { upDir, cdDir, lsDir, catDir, addDir, mkdirDir, rnDir, cpDir, mvDir, rmDir } from './fileSystemOperations.js';
import path from 'node:path';

// let promt = readline.createInterface({input: process.stdin, output: process.stdout, promt: '>  '});
const commands = Object.freeze({
    EXIT: `.exit${EOL}`,
    HELP: `--help${EOL}`,
    OSEOL: `os --EOL${EOL}`,
    OSCPUS: `os --cpus${EOL}`,
    OSHOMEDIR: `os --homedir${EOL}`,
    OSUSERNAME: `os --username${EOL}`,
    OSARCHTECTURE: `os --architecture${EOL}`,
    HASH: `hash`,
    COMPRESS: `compress`,
    DECOMPRESS: `decompress`,
    UP: `up${EOL}`,
    CD: `cd`,
    LS: `ls${EOL}`,
    CAT: `cat`,
    ADD: `add`,
    MKDIR: `mkdir`,
    RN: `rn`,
    CP: `cp`,
    MV: `mv`,
    RM: `rm`,
  });

export class User {
    constructor(name) {
        this.name = name;
    }
    static userName;
    static dirname = dirname(fileURLToPath(import.meta.url));
    static curDIr;
    static workDir = User.dirname.split('\\').map((item, index) => {
        if (typeof item !== 'undefined' && index < 3) return item;
    }).filter((item2) => typeof item2 !== 'undefined').join('\\');
    static parseArgs() {
        argv.forEach((val, index, arr) => {
            if (val.indexOf('--') == 0){
                let userName = val.split('--')[1].split('=')[1];
                User.userName = userName;
                console.clear();
                if (userName.length <= 10){
                    console.log('\x1b[033\x1b[1m', `\x1b[5;0H 
                        ┌─────────────────────────────────────────────────┐
                        │      Welcome to the File Manager,               │
                        └─────────────────────────────────────────────────┘
                    `);
                    console.log('\x1b[33m%s\x1b[0m', `\x1b[7;60H ${userName}! `);
                    console.log('\x1b[9;20H', `You are currently in ${User.workDir}` + EOL);
                    console.log(EOL)
                }else {
                    console.log('\x1b[033\x1b[1m', `\x1b[5;0H   
                        ┌──────────────────────────────────────────────────────────┐
                        │      Welcome to the File Manager,                        │
                        └──────────────────────────────────────────────────────────┘
                    `);
                    console.log('\x1b[33m%s\x1b[0m', `\x1b[7;60H ${userName}! `);
                    console.log('\x1b[9;60H', `You are currently in ${User.workDir}` + EOL);
                    console.log('\u001b[2B', '');
                    console.log('\x1b[5m', '');
                }
                console.log('\x1b[8;0H\x1b[5m');
    
            }
          });
    };
}

User.parseArgs();
User.curDIr = User.workDir;


process.stdin.on('data', data => {
    let tempData = data.toString();
    let addInfo;
    if (tempData.substring(0, 4) == commands.HASH){
        addInfo = tempData.substring(5, (tempData.length - EOL.length));
        tempData = commands.HASH;
    } else if (tempData.substring(0, 8) == commands.COMPRESS){
        addInfo = tempData.substring(9, (tempData.length - EOL.length));
        tempData = commands.COMPRESS;
    }else if (tempData.substring(0, 10) == commands.DECOMPRESS){
        addInfo = tempData.substring(11, (tempData.length - EOL.length));
        tempData = commands.DECOMPRESS;
    }else if (tempData.substring(0, 2) == commands.CD){
        addInfo = tempData.substring(3, (tempData.length - EOL.length));
        tempData = commands.CD;
    }else if (tempData.substring(0, 3) == commands.CAT){
        addInfo = tempData.substring(4, (tempData.length - EOL.length));
        tempData = commands.CAT;
    }else if (tempData.substring(0, 3) == commands.ADD){
        addInfo = tempData.substring(4, (tempData.length - EOL.length));
        tempData = commands.ADD;
    }else if (tempData.substring(0, 5) == commands.MKDIR){
        addInfo = tempData.substring(6, (tempData.length - EOL.length));
        tempData = commands.MKDIR;
    }else if (tempData.substring(0, 2) == commands.RN){
        addInfo = tempData.substring(3, (tempData.length - EOL.length));
        tempData = commands.RN;
    }else if (tempData.substring(0, 2) == commands.CP){
        addInfo = tempData.substring(3, (tempData.length - EOL.length));
        tempData = commands.CP;
    }else if (tempData.substring(0, 2) == commands.MV){
        addInfo = tempData.substring(3, (tempData.length - EOL.length));
        tempData = commands.MV;
    }else if (tempData.substring(0, 2) == commands.RM){
        addInfo = tempData.substring(3, (tempData.length - EOL.length));
        tempData = commands.RM;
    }
    switch (tempData) {
        case commands.EXIT:
            console.clear();
            if (User.userName.length <=10){
                console.log(`\x1b[5;0H   
                    ┌──────────────────────────────────────────────────────────┐
                    │      Thank for using File Manager,                       │
                    └──────────────────────────────────────────────────────────┘
                `);
                console.log('\x1b[33m%s\x1b[0m',`\x1b[7;58H ${User.userName}!`);
                console.log(`\x1b[7;${User.userName.length + 60}H`, `,goodbye!`)
            }else{
                console.log(`\x1b[5;0H   
                    ┌────────────────────────────────────────────────────────────────────────┐
                    │      Thank for using File Manager,                                     │
                    └────────────────────────────────────────────────────────────────────────┘
                `);
                console.log('\x1b[33m%s\x1b[0m',`\x1b[7;58H ${User.userName}!`);
                console.log(`\x1b[7;${User.userName.length + 58}H`, `,goodbye!`)
            }
            console.log(`\x1b[9;50H`);
            process.exit(0);
            break;
        case commands.HELP:
            console.log('\x1b[33m%s\x1b[0m', 'Operation System Info');
            console.table({command: ['--help', 'os --EOL', 'os --cpus', 'os --homedir', 'os --username', 'os --architecture'],
                 description: ['print commands', 'print system End-Of-Line', 'print CPU info', "print home directory", 'system user name', 'CPU architecture']});
            console.log('\x1b[33m%s\x1b[0m', 'Crypto');
            console.table({command: ['hash path_to_file'], description: ['calculate hash for file']});
            console.log('\x1b[33m%s\x1b[0m', 'Archive Operations');
            console.table({command: ['compress path_to_file path_to_destination', 'decompress path_to_file path_to_destination'], 
                description: ['Compress file (using Brotli algorithm)', 'Decompress file (using Brotli algorithm)']});
            console.log('\x1b[33m%s\x1b[0m', 'Navigation & working directory (nwd) ');
            console.table({command: ['up', 'cd path_to_directory', 'ls'], 
                    description: ['Go upper from current directory', 'Go to dedicated folder from current directory', 'Print list of all files and folders']});
            console.log('\x1b[33m%s\x1b[0m', 'Basic operations with files');
            console.table({command: ['cat path_to_file', 'add new_file_name', 'mkdir new_directory_name', 'rn path_to_file new_filename'], 
                description: ['Read file to console', 'Create file in cur. directory', 'Create new directory', 'Rename file']});
                console.table({command: [ 'cp path_to_file path_to_new_directory', 'mv path_to_file path_to_new_directory', 'rm path_to_file'], 
                    description: [ 'Copy file', 'Move file', 'Delete file']});                       
            break;
        case commands.OSEOL: {
            console.log('\x1b[33m%s\x1b[0m', `${JSON.stringify(EOL)}`);
        }
            break;
        case commands.OSCPUS: {
            let model = cpus()[0].model;
            let speed = cpus()[0].speed;
            let coreNum = cpus().length;
            console.log('\x1b[33m%s\x1b[0m', `${model}`);
            console.log('\x1b[33m%s\x1b[0m', `Speed: ${speed} MHz`);
            console.log('\x1b[33m%s\x1b[0m', `Cores: ${coreNum}`);
        };
        break;
        case commands.OSHOMEDIR: {
            console.log('\x1b[33m%s\x1b[0m', `Homedir: ${User.workDir}`);
        };
            break;
        case commands.OSARCHTECTURE: {
            console.log('\x1b[33m%s\x1b[0m', `Architecture: ${process.arch}`);
        }
            break;
        case commands.OSUSERNAME: {
            console.log('\x1b[33m%s\x1b[0m', `System username: ${userInfo().username}`);
        };
            break;
        case commands.HASH: {
            Promise.all([calculateHash(addInfo)]).then((res, rej) => {
                console.log(`256 SHA calculated norm:`)
                res ? console.log('\x1b[33m%s\x1b[0m', res[0]) : console.log(`\x1b[31m%s\x1b[0m`, rej) ;
            })
        };
            break;
        case commands.COMPRESS: {
            Promise.all([compress(addInfo)]).then((res, rej) => {
                res ? console.log('\x1b[33m%s\x1b[0m', `File successfuly archived!`) : console.log(`\x1b[31m%s\x1b[0m`, rej); 
            })
        };
        break;
        case commands.DECOMPRESS: {
            Promise.all([decompress(addInfo)]).then((res, rej) => {
                res ? console.log('\x1b[33m%s\x1b[0m', `File successfuly unarchived!`) : console.log(`\x1b[31m%s\x1b[0m`, rej); 
            });
        };
        break;
        case commands.UP: {
            console.log('\x1b[33m%s\x1b[0m', `You are currently in ${upDir()}`);
        };
        break;
        case commands.CD: {
            Promise.all([cdDir(addInfo)]).then((res) => {
                console.log('\x1b[33m%s\x1b[0m', `You are currently in ${res}`); 
            });
        };
        break;
        case commands.LS: {
            Promise.all([lsDir(addInfo)]).then((lsDir) => {
                console.table(lsDir[0]);
            });
        };
        break;
        case commands.CAT: {    
            Promise.all([catDir(addInfo)]).then((catDir) => {
                console.log('\x1b[33m%s\x1b[0m', `File's conten read without errors: ${EOL} ${catDir}`);
            });
        };
        break;
        case commands.ADD: {
            Promise.all([addDir(addInfo)]).then((filePath) => {
                console.log('\x1b[33m%s\x1b[0m', `New file created: ${EOL} ${filePath}`);
            });
        };
        break;
        case commands.MKDIR: {
            Promise.all([mkdirDir(addInfo)]).then((dirPath) => {
                console.log('\x1b[33m%s\x1b[0m', `New directory created: ${EOL} ${dirPath}`);
            });
        }
        break;
        case commands.RN: {
            Promise.all([rnDir(addInfo)]).then((dirPath) => {
                if (typeof dirPath[0] !== 'undefined') console.log('\x1b[33m%s\x1b[0m', `File remaned from "${addInfo.split(' ')[1]}" to:  ${EOL} ${path.parse(dirPath[0]).base}`);
            });
        };
        break;
        case commands.CP: {
            Promise.all([cpDir(addInfo)]).then((dirPath) => {
                if (typeof dirPath[0] !== 'undefined') console.log('\x1b[33m%s\x1b[0m', `Copy of "${addInfo.split(' ')[0]}" created to: ${EOL} ${dirPath[0]}`);
            });
        };
        break;
        case commands.MV: {
            Promise.all([mvDir(addInfo)]).then((dirPath) => {
                if (typeof dirPath[0] !== 'undefined') console.log('\x1b[33m%s\x1b[0m', `"${addInfo.split(' ')[0]}" moved to: ${EOL} ${dirPath[0]}`);
            });
        };
        break;
        case commands.RM: {
            Promise.all([rmDir(addInfo)]).then((dirPath) => {
                if (typeof dirPath[0] !== 'undefined') console.log('\x1b[33m%s\x1b[0m', `"${addInfo}" deleted!`);
            });
        };
        break;
        default:
            console.log(`\x1b[31m%s\x1b[0m`, 'Invalid input message! Use --help for list valid commands.');   
        break;
    }
});
process.on('SIGINT', () => {
    console.clear();
    if (User.userName.length <=10){
        console.log(`\x1b[5;0H   
            ┌──────────────────────────────────────────────────────────┐
            │      Thank for using File Manager,                       │
            └──────────────────────────────────────────────────────────┘
        `);
        console.log('\x1b[33m%s\x1b[0m',`\x1b[7;49H ${User.userName}!`);
        console.log(`\x1b[7;${User.userName.length + 50}H`, `,goodbye!`)
    }else{
        console.log(`\x1b[5;0H   
            ┌────────────────────────────────────────────────────────────────────────┐
            │      Thank for using File Manager,                                     │
            └────────────────────────────────────────────────────────────────────────┘
        `);
        console.log('\x1b[33m%s\x1b[0m',`\x1b[7;49H ${User.userName}!`);
        console.log(`\x1b[7;${User.userName.length + 50}H`, `,goodbye!`)
    }
    console.log(`\x1b[9;50H`);
    process.exit(0);
});



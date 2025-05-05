import { createReadStream } from 'node:fs';
import path from 'node:path';
import { User } from './index.js';

const calculateHash = async function(filePath) {
    const { createHash } = await import('node:crypto');
    const hmac = createHash('sha256', '');
    return new Promise((resolve, reject) => {
        try {
            let input = '';
            if (!path.isAbsolute(filePath)){
                input = createReadStream(path.resolve(User.curDIr, filePath));
            } else {
                input = createReadStream(filePath);
            }
            input.on('readable', () => {
                const data = input.read();
                if (data){
                    hmac.update(data);
                }else {
                    resolve (hmac.digest('hex'));
                }
            });
            input.on('error', (error) => {
                console.error(error);
            });
        } catch (error) {
            console.error(`\x1b[31m%s\x1b[0m`, `256 Hash calculation for file ${filePath} generate an error`);
            reject(error);
        }
    })
};

export {
    calculateHash,
}
// NOTE this is just a stub
import fs from 'fs/promises';
import path from 'path';
import { withRedisOperation } from '../redisClient.mjs';

export async function dumpSessionLogToFile(sessionId, filePath) {


    const logData = await withRedisOperation(async (redisClient) => {
        const result = await redisClient.lRange(`log:${sessionId}`, 0, -1);
        if (!result || result.length === 0) {
            return null;
        }
        return result.join('\n');

    });

    // TODO select right path if needed
    // TODO create folder if not exists, else it will crash 
    // add a fallback mechanism
    const dest = path.join(filePath, 'logs', sessionId+'.txt') 
    // console.debug(dest)
    await fs.writeFile(dest, logData, 'utf8');

}


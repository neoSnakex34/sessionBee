import { withRedisOperation } from "../redisClient.mjs";

export default async function redisLogTerminate(sessionData) {

    console.log("entered redis logger for session termination");

    const ended = new Date().toISOString();
    
    const sessionId = sessionData['sessionId']

    const operationResult = await withRedisOperation(async (redisClient) => {
        const result = await redisClient.rPush(`log:${sessionId}`, `ended:${ended}`);
        // console.debug('result', result)
        if (result > 0) { 
            console.log("log for session termination created");
            return true;
        }
    });

    return operationResult;

}
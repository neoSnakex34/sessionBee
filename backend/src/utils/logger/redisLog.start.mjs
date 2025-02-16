import { withRedisOperation } from "../redisClient.mjs";

export default async function redisLogStart(sessionData, objId) {

    console.log("entered redis logger for session start");

    const started = sessionData['changedAt'];
    const vendorId = sessionData['vendorId'];
    const sessionId = sessionData['sessionId']

    const operationResult = await withRedisOperation(async (redisClient) => {
        const result = await redisClient.rPush(`log:${sessionId}`, `started:${started}, vendorId:${vendorId}, objId:${objId}`);
        // console.debug('result', result)
        if (result > 0) { 
            console.log("log for session start created");
            return true;
        }
    });

    return operationResult;

}
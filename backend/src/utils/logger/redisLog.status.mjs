import { withRedisOperation } from "../redisClient.mjs";

export default async function redisLogStatusChange(sessionId, status, changedAt) {

    console.log("entered redis logger for session status changer");

    const operationResult = await withRedisOperation(async (redisClient) => {
        const result = await redisClient.rPush(`log:${sessionId}`, `status:${status}, changedAt:${changedAt}`);
        // console.debug('result', result)
        if (result > 0) { 
            console.log("log for session status change registered");
            return true;
        }
    });

    return operationResult;

}
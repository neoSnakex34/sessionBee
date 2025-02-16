import { withRedisOperation } from "./redisClient.mjs";

export async function getExistingSession(objId) {
    const sessionKey = `active_session:${objId}`

    // manage errors with try catch? since it's in withredisoperation should not be needed 
    return await withRedisOperation(async (redisClient) => {
        const existingSession = await redisClient.get(sessionKey);
        return existingSession ? JSON.parse(existingSession) : null; 
    });
    
}
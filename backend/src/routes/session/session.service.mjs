import { withRedisOperation } from "../../utils/redisClient.mjs";
import { getExistingSession } from "../../utils/redisGlobalUtils.mjs";
import { dumpSessionLogToFile } from "../../utils/logger/fileDumper.mjs";
import { dumpLogActive } from "../../app.mjs";
import calculateHash from "../../utils/calculateHash.mjs";
import generateId  from "../../utils/idGen.mjs";
import redisLogStart from "../../utils/logger/redisLog.start.mjs";
import redisLogTerminate from "../../utils/logger/redisLog.terminate.mjs";

// TODO consider adding initial status in a more fancy way by pinging obj 
/**
    Always returns a sessionId either if it exists already or if it is starting a session.
    Session ids are nanoid of 12 or more chars
*/
export async function retrieveSession(objId, vendorId) {

    console.log(`session retrieval requested from: ${objId}`);

    const changedAt = new Date().toISOString();
    const existingSession = await getExistingSession(objId);

    // NOTE if somethings goes south, check this if, it may be true even if the result is empty... js doing js
    if (existingSession) {
        const id = existingSession.sessionId; 
        console.log(`session already active, with id ${id}\n`);
        return id; // do i need it? 
    }

    // if existing session is null i will create an id and initialize a session 

    const sessionId = generateId(12); 
    const authHash = calculateHash(objId, sessionId);
    
    // console.debug('auth:', authHash);
    
    const sessionData = {
        sessionId, 
        vendorId, 
        status: 'on',
        changedAt,
        authHash
    }

    const created = createSessionRedis(objId, sessionData);

    // TODO gracefully handle this case 
    if (!created) { 
        console.error('An error occured while creating session'); 
        return;
    }

    const logSessionCreated = redisLogStart(sessionData, objId);

    if (!logSessionCreated) {
        console.error('An error occured while creating session log');
        return;
    }


    return sessionId;

}

/**
 * 
 * @param {*} objId 
 * @returns true or false
 * always false is session does not exist
 * otherwise it will try to delete it from redis 
 */
export async function terminateSession(objId) {
    
    const existingSession = await getExistingSession(objId);
    
    if (!existingSession) {
        console.error('no valid session for given objId');
        return {deleted: false, objStatus: ''}; // if session does not exists obj status is useless i only return false 
    }
    
    if (existingSession.status === 'off') {
        console.error('could only terminate a session if obj is off');
        return {deleted: false, objStatus: 'noton'} // else i return false and noton (to avoid making confusion with off from other sources) 
    }

    const redisOperationResult = await deleteSessionRedis(objId);
    console.log(redisOperationResult);
    if (!redisOperationResult) {
        console.error("an error occured while terminating session");
        return {deleted: false, objStatus:''}
    }

    const logSessionTerminated = await redisLogTerminate(existingSession);
    if (!logSessionTerminated) {
        console.error("an error occurred while logging session termination");
        // TODO for now is non blocking  
    }

    if (dumpLogActive) {
        await dumpSessionLogToFile(existingSession['sessionId'], process.cwd());
    }
    
    return {deleted: redisOperationResult, objStatus: ''};
}

// utilities 
// TODO refactor in createSessionRedisi
async function createSessionRedis(objId, sessionData) {

    const sessionKey = `active_session:${objId}`

    const operationResult = await withRedisOperation(async (redisClient) => {
        const setResult = await redisClient.set(sessionKey, JSON.stringify(sessionData));

        if (setResult === 'OK') {
            console.log(`session created with key ${sessionKey}`);
            return true;
        } return false;
    });

    return operationResult;


}

/**
 * 
 * @param {*} objId 
 * @returns true or false
 */
async function deleteSessionRedis(objId) {

    const sessionKey = `active_session:${objId}`


    const operationResult = await withRedisOperation(async (redisClient) => {
        const deleted = await redisClient.del(sessionKey);

        if (deleted === 1) {
            console.log(`session ${sessionKey} terminated`);
            return true;
        } else {
            return false;
        }
    });

    return operationResult;


}


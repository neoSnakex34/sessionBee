import redisLogStatusChange from "../../../utils/logger/redisLog.status.mjs";
import { withRedisOperation } from "../../../utils/redisClient.mjs";
import { getExistingSession } from "../../../utils/redisGlobalUtils.mjs";
import getSessionKey from "../../../utils/getSessionKey.mjs";

export async function litObj(objId) {

    console.log(`object positive toggle requested from: ${objId}`);

    // NOTE since i already retrieve existing session in auth i may want to pass to handler and let handler pass it here
    const existingSession = await getExistingSession(objId);    

    if (!existingSession) {
        console.error("could not toggle an obj if it is not on active session");
        return {on: false, reason: 'nosession'}; 
    }

    if (existingSession.status === 'on') {
        console.error("obj is already on"); 
        return {on: false, reason: 'alreadyon'}
    }

    // NOTE warning on consistency here
    const {on, reason, changedAt} = await litObjRedis(objId, existingSession);

    // opposite from session logging, status logging will be triggered only after it happens
    if (on) { // only if status changed i will log, status problems are already handled
        const sessionId = existingSession['sessionId'];
        const logStatusChanged = redisLogStatusChange(sessionId, 'on', changedAt);
        if (!logStatusChanged) {
            console.error("error while logging status change for toggling");
        }
    
    }

    return {on: on, reason: reason}
}

export async function unlitObj(objId) {
    
    console.log(`obj turning off requested from: ${objId}`);

    const existingSession = await getExistingSession(objId);
    
    // console.debug("Existing session status:",existingSession.status);
    
    if (!existingSession) {
        console.error("could not negative toggle an obj if it is not on active session");
        return {off: false, reason: 'nosession'}; 
    }
    if (existingSession.status === 'off') {
        console.error("obj is already off");
        return {off: false, reason: 'alreadyoff'};
    }

    
    // NOTE warning on consistency 
    const {off, reason, changedAt} = await unlitObjRedis(objId, existingSession);

    if (off) {
        const sessionId = existingSession['sessionId'];
        const logStatusChanged = redisLogStatusChange(sessionId, 'off', changedAt);
        if (!logStatusChanged) {
            console.error("error while logging status change for closing");
        }
    }

    return { off: off, reason: reason }
    
}

// private utilities 

async function litObjRedis(objId, sessionData) {

    console.log('entered redis operation function');

    const sessionKey = getSessionKey(objId);
    const changedAt = new Date().toISOString();

    sessionData.changedAt = changedAt;
    sessionData.status = 'on';

    const operationResult = await withRedisOperation(async (redisClient) => {

        const setResult = await redisClient.set(sessionKey, JSON.stringify(sessionData));

        // console.debug('setresult is:', setResult);

        if (setResult === 'OK') {
            console.log(`obj ${objId} turned on in redis`);
            return { on: true, reason: '', changedAt: changedAt }; // can i return one more object just here?
        } return { on: false, reason: 'rediserror' };

    });

    return operationResult;
}


async function unlitObjRedis(objId, sessionData) {

    console.log('entered redis operation function');

    const sessionKey = getSessionKey(objId);
    const changedAt = new Date().toISOString();

    sessionData.changedAt = changedAt;
    sessionData.status = 'off';

    const operationResult = await withRedisOperation(async (redisClient) => {

        const setResult = await redisClient.set(sessionKey, JSON.stringify(sessionData));

        // console.debug('setresult is:', setResult);

        // redis result be like this
        if (setResult === 'OK') {
            console.log(`obj ${objId} turned off in redis`);
            return { off: true, reason: '', changedAt: changedAt };
        } return { off: false, reason: 'rediserror' };

    });

    return operationResult;


}


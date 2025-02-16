import { getExistingSession } from "../utils/redisGlobalUtils.mjs";

export default async function authMiddleware(req, res, next) {
    
    console.log("entered auth middleware");
    
    try {
        
        const objId  = req.params['objId']; 
        const rawClientHash = req.headers['authorization'];
        const clientHash = rawClientHash.split(" ")[1]
        console.log(clientHash)
        if (!clientHash || !objId) {
            console.log('could not authenticate because of missing parameters')
            return res.status(403).json('could not authenticate: objId and authorization token needed to start authentication');
        }

        const sessionData = await getExistingSession(objId);
        if (!sessionData) { 
            console.log('session has not been found while trying to authorize it');
            return res.status(404).json('session not found for given objId'); 
        }

        const serverHash = sessionData.authHash;
        if (serverHash !== clientHash) {
            console.log('auth token hash is not valid');
            return res.status(401).json('authentication token is invalid for given objId');
        }

        next();

    } catch (err) {
        console.error('error occured during authentication:', err);
        res.status(500).json('Internal server error');
    }
}

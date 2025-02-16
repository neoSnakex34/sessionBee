import { retrieveSession, terminateSession } from "./session.service.mjs";

// NOTE what now is objId in this section can be modularized to be anything else with an id, in a future version with ts generics one could improve this
// for this reason obj routes are a subdirectory of sessionroutes 
export async function retrieveSessionHandler(req, res) { 
    try {
        const { objId } = req.params;
        const { vendorId } = req.body;

        const sessionId = await retrieveSession(objId, vendorId);
        
        // TODO this should have the same logic as on/off requests in future 
        // i will use vendorId as a validator/auth probably
        // december 2024
        if (!sessionId) {
            return res.status(500).json('an error occured on server during session creation');
        }

        return res.status(201).json({sessionId});

    } catch (err) {

        console.error('Error during session creation: ', err);
        return res.status(500).json('an error occured on server during session creation/retrieval');

    }

}

export async function terminateSessionHandler(req, res)  {
    
    try {

        const { objId } = req.params; 
         
        const { deleted, objStatus } = await terminateSession(objId); 

        if (deleted === true) {
            return res.status(200).json('session terminated successfully');
        } else {
            if (objStatus === '') {
                return res.status(404).json('could not terminate session due to session not existing ');
            } if (objStatus === 'notoff') {
                return res.status(409).json('obj must be off');
            }
        }

    } catch (err) {

        console.error('Error during session termination: ', err);
        return res.status(500).json('server could not terminate session');
    }
}

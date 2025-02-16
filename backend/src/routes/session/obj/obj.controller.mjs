import { unlitObj, litObj } from "./obj.service.mjs";

export async function unlitObjHandler(req, res) {
    
    try {

        const { objId } = req.params; 

        // TODO add status check here or in service, decide later

        const { off, reason } = await unlitObj(objId);
        
        if (off === true) {
            return res.status(200).json('turned off successfully');
        } else {
            if (reason === 'alreadyoff') {
                return res.status(400).json('could not turn off an already unlit obj');
            }
            
            if (reason === 'rediserror') {
                return res.status(500).json('could not turn off due to a database error'); // FIXME add right return code
            } 
            
            if (reason === 'nosession') {
                return res.status(404).json('could not turn off cause no session found for given obj')
            }
        }

    } catch (err) {
        console.error('error turning off obj', err);
        return res.status(500);
    }

}

export async function litObjHandler(req, res) {

    try {

        const { objId } = req.params; 

        const { on, reason }= await litObj(objId);
        
        if (on === true) {
            return res.status(200).json('turned on successfully');
        } else {
            if (reason === 'alreadyon') {
                return res.status(400).json('could not turn on an already lit obj');
            }

            if (reason === 'rediserror') {
                return res.status(500).json('could not turn on due to a database error');
            }

            if (reason === 'nosession') {
                return res.status(404).json('could not turn due to  session not started'); // FIXME add right return code
        
            }
        }

    } catch (err) {
        console.error('error turning on obj', err);
        return res.status(500);
    }

}


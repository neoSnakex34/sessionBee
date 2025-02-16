
import idValidator from "../utils/idValidator.mjs";

export function idValidatorMiddleware(req, res, next) {

    // console.debug('validator params', req.params);
    const { objId } = req.params; 

    console.log('-'.repeat(10)); 
    console.log(`entered id validator for ${objId}`); // this will be useful for understanding requests origin
    
    // if id is undefined it will be interpreted as a string "undefined" for reasons...

    if (!idValidator(objId) || objId === 'null' || objId === 'undefined') {
        return res.status(400).json('objId given is not a valid nanoid or no id given');
        // TODO log frontend with a message about invalid id SEVERE CASE
    }

    if (req.path === '/api/v1/session/:objId/start') {
        const { vendorId } = req.body;

        if (!idValidator(vendorId)) {
            return res.status(400).json('objId or vendorId given are not valid nanoid or no id given');
        }
    }

    next();

}
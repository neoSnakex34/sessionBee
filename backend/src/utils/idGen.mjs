import { nanoid } from "nanoid";

// TODO decide wether to fix a max len or not
const generateId = (len) => {
    if (len < 12 || !len) {
        console.log('the len must be 12 minimum, a 12 char id is being generated as a fallback');
        return nanoid(12);
    }

    return nanoid(len);
}

export default generateId

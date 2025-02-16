
/**
 * validate a nanoid on its basic alphabet via a regex
 */
const idValidator = (id) => {
    const pattern = /[A-Za-z0-9_-]/;
    return pattern.test(id);
}

export default idValidator
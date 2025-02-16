import crypto from 'crypto';

/**
 * calculates a hash (sha256sum) of a base string + a salt value
 * @returns a hex value
 */
const calculateHash = (base, salt) => {
    const hash = crypto.createHash('sha256');
    // it will hash the string, not the bytes
    const toBeHashed = base + salt; 
    hash.update(toBeHashed);

    return hash.digest('hex');
}

export default calculateHash
import Redis from 'redis';
import dotenv from 'dotenv';
import { createPool } from "generic-pool";

dotenv.config();

/**
 * 
 * @param {*} callback 
 * @returns the callback passed
 * executes a callback function after borrowing a connection
 * from the connection pool
 * finally releases the connection 
 * 
 */
export async function withRedisOperation(callback) {
    
    const redisClient = await redisPool.acquire();
    try {
        const output = await callback(redisClient);
        return output; 
    } catch (err) {
        // TODO this should be handled gracefully and restart connection 
        console.error('error during redis operation:', err);
        throw err;
    } finally {
        await redisPool.release(redisClient);
    }
}

// from generic pool documentation 
const factory = {
    create: async () => {
        const client = Redis.createClient({
            // url: process.env.REDIS,
            // FIXME check this and make host a env var 
            socket: {
                host: "localhost", 
                port: 6379,
            }
        });

        // FIXME this prevents "ECONRESET" on redis from crashing whole backend, 
        // it need further investigation
        client.on('error', (err) => {
            console.error('REDIS CLIENT ERROR:', err);
        });

        await client.connect();
        return client;
    },
    
    destroy: async (client) => {
        await client.disconnect();
    },
};

const redisPool = createPool(factory, {
    max: 30, 
    min: 2, 
    idleTimeoutMillis: 30000, 
    // idleTimeoutMillis: 30000, 
    evictionRunIntervalMillis: 10000, 
    // evictionRunIntervalMillis: 10000, 
});

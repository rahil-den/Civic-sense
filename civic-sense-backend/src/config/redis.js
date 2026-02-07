import Redis from 'ioredis';

let redisClient;

const connectRedis = () => {
    if (!redisClient) {
        redisClient = new Redis(process.env.REDIS_URI, {
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: null,
        });

        redisClient.on('connect', () => {
            console.log('Redis Connected');
        });

        redisClient.on('error', (err) => {
            console.error('Redis Error:', err);
        });
    }
    return redisClient;
};

export { connectRedis };
export default connectRedis(); // Export singleton instance by default, but allow manual connect call

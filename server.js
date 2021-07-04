const fastify = require('fastify')({
    logger: true
});
const PORT = process.env.port || 3000;
const dotenv = require('dotenv');
const fastifyRedis = require('fastify-redis');

dotenv.config();

const redisConfig = {
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASS
}

fastify.register(fastifyRedis, redisConfig);

fastify.register(require('./routes/default-route'));

const start = async () => {
    try {
        await fastify.listen(PORT);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();
const DB = require('../mock/db');
const db = new DB();
async function routes(fastify, options) {
    const {redis} = fastify;

    fastify.get('/', async (request, reply) => {
        reply
            .code(200)
            .type('text/html')
            .send(`This is a sample implementation of integrating Redis with Fastify`);
    })

    fastify.put('/user/:id', async (request, reply) => {
        const userId = request.params["id"];
        const {name,age,country} = request.body;

        if(!userId || !name || !age || !country){
            throw new Error("Invalid Parameters");
        }
        const body = {name,age,country};
        try {
            const val = await redis.set(`user_id:${userId}`,JSON.stringify(body));
            let message;
            val=="OK"?message="Successful":message="Something went wrong";
            reply.
                    send({
                        message:message
                    })
        } catch (error) {
            throw new Error(error);
        }

    })

    fastify.get('/user/:id', async (request, reply) => {
        const userId = request.params["id"];
        if(!userId){
            throw new Error("Invalid UserID");
        }
        let val;
        try {
            val = await redis.get(`user_id:${userId}`);
            reply
            .send({
                message:"Successful",
                data:val && val !== ""?JSON.parse(val):null
            })
        } catch (error) {
            throw new Error(error);
        }

    })

    fastify.get('/db_user/:id', async (request, reply) => {
        const userId = request.params["id"];
        if(!userId){
            throw new Error("Invalid UserID");
        }
        let val,val_db;
        try {
            val = await redis.get(`user_id:${userId}`);
            if(!val || val==""){
                val_db = await db.getUser(userId);
            }
            console.log(`Value${val}.`);
            reply
            .send({
                message:"Successful",
                data:val_db?val_db:(val && val !== ""?JSON.parse(val):null)
            })
            if(val_db)
            await redis.set(`user_id:${userId}`,JSON.stringify(val_db));
        } catch (error) {
            throw new Error(error);
        }

    })

    fastify.post('/db_user/:id', async (request, reply) => {
        const userId = request.params["id"];
        const {name,age,country} = request.body;

        if(!userId || !name || !age || !country){
            throw new Error("Invalid Parameters");
        }
        const body = {name,age,country};
        try {
            const val = await db.addUser(userId,body);
            let message = val?"Successful":"Something went wrong";
            reply.
                    send({
                        message:message
                    })
        } catch (error) {
            throw new Error(error);
        }

    })

    fastify.delete('/user', async (request,reply) => {
        await redis.flushdb();
        reply.
        send({status:"OK"})
    })

    fastify.get('/*', async (request, reply) => {
        reply
            .redirect('/');
    })

}

module.exports = routes;

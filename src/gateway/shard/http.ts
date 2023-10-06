import fastify from 'fastify';
import { Collection } from '@discordeno/utils';
import { DiscordenoShard } from '@discordeno/gateway';

const authorization = process.env.AUTHORIZATION;
const workerId = parseInt(process.env.WORKER_ID);
const port = parseInt(process.env.BASE_SHARD_PORT) + workerId;
const token = process.env.DISCORD_TOKEN;
const botUrl = process.env.BOT_SERVER_URL;

const shards = new Collection<number, DiscordenoShard>();

const app = fastify();

app.all('/*', async (req, res) => {
    if (req.headers.authorization !== authorization) {
        res.code(401);
        return { error: 'Invalid authorization key.' };
    }

    const body = req.body as Record<PropertyKey, any>;

    try {
        switch (body['type']) {
            case 'IDENTIFY_SHARD': {
                const shardId = body['shardId'];

                console.log('[Shard] identifying %s shard (%d)', shards.has(shardId) ? 'existing' : 'new', shardId);

                let shard = shards.get(shardId);

                if (!shard) {
                    shard = new DiscordenoShard({
                        id: shardId,
                        connection: {
                            ...body['connection'],
                            token,
                        },
                        events: {
                            async message(_shard, payload) {
                                await fetch(botUrl, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        authorization,
                                    },
                                    body: JSON.stringify({ payload, shardId }),
                                }).catch(console.error);
                            },
                        },
                    });

                    shard.forwardToBot = (packet) => {
                        shard?.events.message?.(shard, packet);
                    };
                }

                shards.set(shard.id, shard);

                // Resume does call identify if the shard has never been identified
                await shard.resume();

                return {
                    identified: true,
                    shardId,
                    workerId,
                };
            }
            default: {
                console.error(`[Shard] Unknown request received.`, body);

                res.code(404);
                return { message: 'Unknown request received.', status: 404 };
            }
        }
    }
    catch (error) {
        console.error(error);

        res.code(500);
        return error;
    }
});

await app.listen({
    port
});

console.log("Shard Worker running at port", port);

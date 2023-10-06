import { Intents } from "@discordeno/types";
import { createGatewayManager } from '@discordeno/gateway';

import restManager from './rest.js';

const token = process.env.DISCORD_TOKEN;

export const gatewayManager = createGatewayManager({
    token,
    intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
    events: {},
    shardsPerWorker: 5,
    totalWorkers: 1,
    connection: await restManager.getSessionInfo(),
});

gatewayManager.tellWorkerToIdentify = async (workerId, shardId) => {
    const url = process.env.BASE_SHARD_URL + (parseInt(process.env.BASE_SHARD_PORT) + workerId);

    if (!url) {
        console.error(`No server URL found for server #${workerId}. Unable to start Shard #${shardId}`);
        return;
    }

    const connection = {
        compress: gatewayManager.compress,
        intents: gatewayManager.intents,
        properties: gatewayManager.properties,
        totalShards: gatewayManager.totalShards,
        url: gatewayManager.url,
        version: gatewayManager.version,
    };

    await fetch(url, {
        method: 'POST',
        headers: {
            authorization: process.env.AUTHORIZATION,
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            type: 'IDENTIFY_SHARD',
            shardId,
            connection
        }),
    }).catch(console.error);
};

gatewayManager.spawnShards();

export default gatewayManager;

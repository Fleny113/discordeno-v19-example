import fastify from "fastify";
import type { GatewayDispatchEventNames } from "@discordeno/bot";

import bot from "./bot.js";

const authorization = process.env.AUTHORIZATION;
const port = parseInt(process.env.BOT_PORT);

const app = fastify();

app.all('/*', async (req, res) => {
    if (req.headers.authorization !== authorization) {
        res.code(401);
        return { error: 'Invalid authorization key.' };
    }

    const body = req.body as Record<PropertyKey, any>;
    const shardId = body["shardId"];
    const payload = body["payload"];

    try {
        // OPTIONAL: Runs the raw event handler if you need it
        bot.events.raw?.(payload, shardId);

        // Runs the event handler if available
        if (payload.t)
            bot.handlers[payload.t as GatewayDispatchEventNames]?.(bot, payload, shardId);

        return { success: true };
    }
    catch (error) {
        bot.logger.error(error);

        res.code(500);
        return error;
    }
});

await app.listen({
    port
});

bot.logger.info(`Bot process running at port ${port}`);

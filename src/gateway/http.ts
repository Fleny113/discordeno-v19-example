import fastify from "fastify";
import gatewayManager from "./manager.js";

const AUTHORIZATION = process.env.AUTHORIZATION;
const port = parseInt(process.env.GATEWAY_PORT);

const app = fastify();

app.all('/*', async (req, res) => {
    if (req.headers.authorization !== AUTHORIZATION) {
        res.code(401);
        return { error: 'Invalid authorization key.' };
    }

    // TODO: properly validate the body shape
    const body = req.body as Record<PropertyKey, any>;

    try {
        switch (body["type"]) {
            case 'REQUEST_MEMBERS': {
                return await gatewayManager.requestMembers(body["guildId"], body["options"]);
            }
            default: {
                console.error(`[GatewayManager] Unknown request received.`, body);

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

console.log("Gateway Manager running at port", port);


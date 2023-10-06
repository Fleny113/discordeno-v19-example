import fastify from "fastify";
import type { RequestMethods } from "@discordeno/rest";

import restManager from "./rest.js";

const authorization = process.env.AUTHORIZATION;
const port = parseInt(process.env.REST_PORT);

const app = fastify();

app.all("/*", async (req, res) => {
    if (req.headers.authorization !== authorization) {
        res.code(401);
        return { error: "Invalid authorization key." };
    }

    const url = req.url.slice(4);
    const body = req.method === "GET" || req.method === "DELETE" ? undefined : req.body;

    try {
        const result = await restManager.makeRequest(req.method as RequestMethods, url, {
            body
        });

        if (result)
            return result;

        res.code(204);
        return {};
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

console.log("Rest proxy running at port", port);

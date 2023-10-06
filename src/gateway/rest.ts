import { createRestManager } from '@discordeno/rest';

const token = process.env.DISCORD_TOKEN;
const restUrl = process.env.REST_SERVER_URL;
const authorization = process.env.AUTHORIZATION;

export const restManager = createRestManager({
    token,
    proxy: {
        baseUrl: restUrl,
        authorization,
    }
});

export default restManager;

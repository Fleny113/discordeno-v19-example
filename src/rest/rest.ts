import { createRestManager } from '@discordeno/rest';

const token = process.env.DISCORD_TOKEN;

export const restManager = createRestManager({
    token,
});

export default restManager;

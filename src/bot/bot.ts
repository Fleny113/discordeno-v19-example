import { createBot } from "@discordeno/bot";
import defineDesiredProperties from "./proprieties.js";

const token = process.env.DISCORD_TOKEN;
const authorization = process.env.AUTHORIZATION;
const restServerUrl = process.env.REST_SERVER_URL;

export const bot = createBot({
    token,
    events: {},
    rest: {
        proxy: {
            authorization,
            baseUrl: restServerUrl,
        }
    }
});

defineDesiredProperties(bot.transformers.desiredProperties);

// TODO: move events in they own files, keeping like this is not scalable but it's useful for example purposes

bot.events.ready = ({ user, shardId }) => {
    bot.logger.info(`Logged in as ${user.username}#${user.discriminator} (Shard ${shardId})`);
};

bot.events.messageCreate = async (message) => {
    if (message.author.bot)
        return;

    if (message.content === "test-command") {
        await bot.helpers.sendMessage(message.channelId, {
            content: "Hi from a multi-process discordeno setup!",
        });
    }
};

export default bot;

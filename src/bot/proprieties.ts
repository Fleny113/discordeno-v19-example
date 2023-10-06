import type { Transformers } from "@discordeno/bot";

export default function defineDesiredProperties(props: Transformers["desiredProperties"]) {
    // User
    props.user.bot = true;
    props.user.username = true;
    props.user.discriminator = true;

    // Messages
    props.message.author = true;
    props.message.content = true;
    props.message.channelId = true;
}

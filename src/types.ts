declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly DISCORD_TOKEN: string;

            readonly AUTHORIZATION: string;

            readonly REST_PORT: string;
            readonly REST_SERVER_URL: string;

            readonly GATEWAY_PORT: string;
            readonly GATEWAY_SERVER_URL: string;

            readonly BASE_SHARD_PORT: string;
            readonly BASE_SHARD_URL: string;
            readonly WORKER_ID: string;

            readonly BOT_PORT: string;
            readonly BOT_SERVER_URL: string;
        }
    }
}

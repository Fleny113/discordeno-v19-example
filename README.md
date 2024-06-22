# Discordeno multi-process example setup

Example code for starting development of a [Discordeno](https://github.com/discordeno/discordeno) v19 bot using a multi-process approach

This is an example code that creates a basic command-based command (`test-command`) and sends a message

You will need a bot that can use the MESSAGE_CONTENT intent.

> [!IMPORTANT]
> This code is made only to be a starting point. While based on the discordeno.js.org guide for big bots it's not
> at all supposed to be usable in any kind of production. As it does a bit of my own decisions to make the processes comunicate.

> [!WARNING]
> This code relies on node v20.6 or upper as it uses `--env-file`, it you are running a lower version then you need to use `dotenv`
> and remove the flag from the `--env-file` flag

## File structure

A general pattern that is followed in this code is this:

- An `http.ts` file is used to create a listener for the other processes to comunicate with it
- An `rest.ts` creates the rest manager that that application is using

### File list

```ts
src
----- bot
--------- bot.ts // Used to create the bot object and set the events
--------- http.ts // Used to create the HTTP server to be able to receive the events from the shards
--------- proprieties.ts // Helper file to set the desiredProprieties of the transformers
---- gateway
--------- shard
------------- http.ts // Used to receive the requests from the gateway manager and handle them accordingly (eg. identify a new shard)
--------- http.ts // Used to make the bot process be able to send gateway messages [Not actually implemented]
--------- manager.ts // Used to create the gateway manager and set the tellWorkerToIdentify to then comunicate the workers processes to identify
--------- rest.ts // Used to create a rest manager to get the session information from discord
---- rest
--------- http.ts // Used to create the HTTP server to receive the rest requests and forward them to discord
--------- rest.ts // Used to create the rest manager that sends the requests to discord
---- types.ts // Used to make typescript happy about the use of ENV, not actually relevant to the functionality
```

## How to run the code

Compile the code, you can simply run `tsc` or run the `build` npm script

Run the 4 processes required

- The bot process, you can run it using the `run:bot` npm script
- The rest process, you can run it using the `run:rest` npm script
- The gateway manager, you can run it using the `run:gateway` npm script
- The sharding worker process, you need to first set the `WORKER_ID` env (an incremental number starting from 0), then run the `run:shard` npm script

## Environment variables

You can find an example configuration on the `.env.example` file

**You will need to manually set the `WORKER_ID`** that is used to calculate the port to where the sharding worker should listen

- `DISCORD_TOKEN` is the token of your discord bot
- `AUTHORIZATION` is the string used to validate that the requests are coming from your code and not someone else
- `REST_PORT` is the port where the rest proxy listens
- `REST_SERVER_URL` is the url to where the bot/gateway processes can find the rest proxy
- `GATEWAY_PORT` is the port where the gateway manager listens
- `GATEWAY_SERVER_URL` is the url to where the bot can find the gateway manager to send data to discord, eg REQUEST_MEMBERS[^gateway]
- `BASE_SHARD_PORT` is the port where the sharding workers should listen, in this example it's used plus the `WORKER_ID` **MANUALLY** set to get the port to listen to
- `BASE_SHARD_URL` is the base url where the gateway manager can append the port to then contact the sharding workers
- `BOT_PORT` the port where the bot process listens
- `BOT_SERVER_URL` the url where the sharding workers can send the events they receive to then be handled by your bot code

[^gateway]: This is not implemented in this code, but the listener does exist

## Potential changes you want to make

- Actually implement the logic to make the bot process be able to contact the gateway manager to send the requests
- Don't use a `BASE_SHARD_PORT` and `BASE_SHARD_URL`, i don't believe it's the most practical way to do this, it's sure a way tho
- Use a better way to get the `WORKER_ID`, setting it manually does work, but it's a bit clunky
- Separate a bit more the code for handling the events in the bot process

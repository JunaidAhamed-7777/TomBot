# TomBot

TomBot was built for Hideout and works in any Discord server that installs it. Select TomBot from Discord’s mention list and send `@TomBot ping`. The bot replies with `Ping: 42ms`, using the measured round-trip time in milliseconds. [Hideout server invite](https://discord.gg/saul)

## Set up Discord

1. Create an application named **TomBot**. Open **Bot**, use **Reset Token** to generate its token, and save it privately for the local setup below. Enable **Public Bot** to let other people install it in servers they manage. [Discord Developer Portal](https://discord.com/developers/applications) · [Bot authorization](https://docs.discord.com/developers/topics/oauth2#bot-authorization-flow)
2. In **Installation**, select **Guild Install** as the installation context and **Discord Provided Link** as the install link. Under **Default Install Settings → Guild Install**, add the `bot` scope and select **View Channel**, **Send Messages**, and **Read Message History**. To use the command in threads, also grant **Send Messages in Threads**. [Discord installation setup](https://docs.discord.com/developers/quick-start/getting-started#setting-up-an-install-link) · [Reply permissions](https://docs.discord.com/developers/resources/message#create-message) · [Thread permissions](https://docs.discord.com/developers/topics/permissions#inherited-permissions-threads)
3. Open the app’s install link, choose **Add to Server**, and select a server. The person authorizing the install needs **Manage Server** there. Check that TomBot has the selected permissions in the channel where you’ll test. [Discord installation contexts](https://docs.discord.com/developers/quick-start/getting-started#choosing-installation-contexts)

Leave **Message Content Intent** off. Discord includes the text of messages that directly mention the app. [Discord Gateway documentation](https://docs.discord.com/developers/events/gateway#message-content-intent)

## Run locally

Install Node.js 24.17 or later and run these commands in PowerShell from the repository directory. [Node.js downloads](https://nodejs.org/en/download)

```powershell
npm ci
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Open `.env` and set `DISCORD_TOKEN` to the token from the **Bot** page. Keep it in your local `.env`, which Git ignores.

```powershell
npm start
```

Leave the process running. Once TomBot is online, send `@TomBot ping` in a server where it’s installed. The bot reports its Discord Gateway heartbeat round-trip time. Until the first heartbeat is acknowledged, it measures a Discord HTTP request. [Discord Gateway heartbeats](https://docs.discord.com/developers/events/gateway#sending-heartbeats)

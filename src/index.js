import { Client, Events, GatewayIntentBits } from 'discord.js';
import { replyToPing } from './commands/ping.js';

const token = process.env.DISCORD_TOKEN?.trim();
const guildId = process.env.DISCORD_GUILD_ID?.trim();

if (!token) {
  console.error('Set DISCORD_TOKEN to your Discord bot token.');
  process.exit(1);
}

if (!guildId || !/^[1-9]\d{0,19}$/.test(guildId)) {
  console.error('Set DISCORD_GUILD_ID to the Discord server ID.');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}.`);

  if (!readyClient.guilds.cache.has(guildId)) {
    console.warn(`TomBot is not in server ${guildId}. Check the app installation and server ID.`);
  }
});

client.on(Events.MessageCreate, async message => {
  if (message.guildId !== guildId) return;

  try {
    await replyToPing(message);
  } catch (error) {
    console.error('Could not reply to ping:', error.message);
  }
});

client.on(Events.Error, error => {
  console.error('Discord client error:', error.message);
});

try {
  await client.login(token);
} catch (error) {
  console.error('Could not log in to Discord:', error.message);
  await client.destroy();
  process.exitCode = 1;
}

import { Client, Events, GatewayIntentBits } from 'discord.js';
import { replyToPing } from './commands/ping.js';

const token = process.env.DISCORD_TOKEN?.trim();

if (!token) {
  console.error('Set DISCORD_TOKEN to your Discord bot token.');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}.`);
});

client.on(Events.MessageCreate, async message => {
  if (!message.inGuild()) return;

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

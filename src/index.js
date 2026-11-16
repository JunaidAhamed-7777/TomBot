import { Client, Events, GatewayIntentBits } from 'discord.js';
import { replyToPing, replyToSlashPing, slashPingCommand } from './commands/ping.js';

const token = process.env.DISCORD_TOKEN?.trim();

if (!token) {
  console.error('Set DISCORD_TOKEN to your Discord bot token.');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once(Events.ClientReady, async readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}.`);

  try {
    const commands = readyClient.application.commands;
    const registeredCommands = await commands.fetch();
    if (!registeredCommands.some(command => command.equals(slashPingCommand))) {
      await commands.create(slashPingCommand);
    }
    console.log('/ping is registered.');
  } catch (error) {
    console.error('Could not register /ping:', error.message);
  }
});

client.on(Events.MessageCreate, async message => {
  if (!message.inGuild()) return;

  try {
    await replyToPing(message);
  } catch (error) {
    console.error('Could not complete ping:', error.message);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand() || !interaction.inGuild()) return;
  if (interaction.commandName !== slashPingCommand.name) return;

  try {
    await replyToSlashPing(interaction);
  } catch (error) {
    console.error('Could not complete /ping:', error.message);
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

import { ApplicationCommandType, ApplicationIntegrationType, InteractionContextType } from 'discord.js';

const mentionPingPattern = /^<@!?(\d+)>\s+ping$/i;
const allowedMentions = { repliedUser: false };
const pendingReply = { content: 'Ping: …ms', allowedMentions };

export const slashPingCommand = {
  name: 'ping',
  description: 'Show how long TomBot takes to reply.',
  type: ApplicationCommandType.ChatInput,
  integrationTypes: [ApplicationIntegrationType.GuildInstall],
  contexts: [InteractionContextType.Guild],
};

function pingResult(startedAt, repliedAt) {
  const latency = Math.max(0, repliedAt - startedAt);
  return { content: `Ping: ${latency}ms`, allowedMentions };
}

export async function replyToPing(message) {
  if (message.author.bot || message.webhookId || message.system) return;

  const botId = message.client.user?.id;
  const mentionedId = mentionPingPattern.exec(message.content.trim())?.[1];
  if (!botId || mentionedId !== botId || !message.mentions.users.has(botId)) return;

  const reply = await message.reply({
    ...pendingReply,
    nonce: message.id,
    enforceNonce: true,
  });

  await reply.edit(pingResult(message.createdTimestamp, reply.createdTimestamp));
}

export async function replyToSlashPing(interaction) {
  const response = await interaction.reply({ ...pendingReply, withResponse: true });
  const reply = response.resource?.message ?? await interaction.fetchReply();
  await interaction.editReply(pingResult(interaction.createdTimestamp, reply.createdTimestamp));
}

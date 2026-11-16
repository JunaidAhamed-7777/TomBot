const pingCommand = /^<@!?(\d+)>\s+ping$/i;

export async function replyToPing(message) {
  if (message.author.bot || message.webhookId || message.system) return;

  const botId = message.client.user?.id;
  const mentionedId = pingCommand.exec(message.content.trim())?.[1];
  if (!botId || mentionedId !== botId || !message.mentions.users.has(botId)) return;

  const allowedMentions = { repliedUser: false };
  const reply = await message.reply({
    content: 'Ping: …ms',
    allowedMentions,
    nonce: message.id,
    enforceNonce: true,
  });

  const latency = Math.max(0, reply.createdTimestamp - message.createdTimestamp);
  await reply.edit({ content: `Ping: ${latency}ms`, allowedMentions });
}

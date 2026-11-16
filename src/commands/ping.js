import { Routes } from 'discord.js';

const pingCommand = /^<@!?(\d+)>\s+ping$/i;
let pendingLatencyProbe;

async function measureHttpLatency(client) {
  const startedAt = performance.now();
  await client.rest.get(Routes.user());
  return performance.now() - startedAt;
}

export async function replyToPing(message) {
  if (message.author.bot || message.webhookId || message.system) return;

  const botId = message.client.user?.id;
  const mentionedId = pingCommand.exec(message.content.trim())?.[1];
  if (!botId || mentionedId !== botId || !message.mentions.users.has(botId)) return;

  let latency = message.client.ws.ping;
  if (!Number.isFinite(latency) || latency < 0) {
    // Share the HTTP request if several commands arrive before the first heartbeat acknowledgement.
    pendingLatencyProbe ??= measureHttpLatency(message.client).finally(() => {
      pendingLatencyProbe = undefined;
    });
    latency = await pendingLatencyProbe;
  }

  await message.reply({
    content: `Ping: ${Math.round(latency)}ms`,
    allowedMentions: { repliedUser: false },
  });
}

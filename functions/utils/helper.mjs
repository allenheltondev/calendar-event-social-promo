import { Client, GatewayIntentBits } from 'discord.js';
import { getSecret } from '@aws-lambda-powertools/parameters/secrets';
import crypto from 'crypto';

let client;

export const createHashKey = (data) => {
  const payload = JSON.stringify(data);
  const hmac = crypto.createHmac('sha256', process.env.HMAC_SECRET);
  hmac.update(payload);

  return hmac.digest('hex');
};

export const verifyHashKey = (data, hashKey) => {
  const key = createHashKey(data);

  return key === hashKey;
};


export const getDiscordClient = async () => {
  if (!client) {
    client = new Client({ intents: [GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
    const secrets = await getSecret(process.env.SECRET_ID, { transform: 'json' });
    await client.login(secrets.discord);
  }

  return client;
};

import { Client, GatewayIntentBits, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from 'discord.js';
import { getSecret } from '@aws-lambda-powertools/parameters/secrets';

const client = new Client({ intents: [GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
let clientLoggedIn = false;

export const handler = async (state) => {
  try {
    if (!clientLoggedIn) {
      const secrets = await getSecret(process.env.SECRET_ID, { transform: 'json' });
      await client.login(secrets.discord);
      clientLoggedIn = true;
    }

    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const events = await guild.scheduledEvents.fetch();
    const existingEvent = events.find(e => e.name === state.title);
    if (existingEvent) {
      return { id: existingEvent.id };
    }

    const createdEvent = await guild.scheduledEvents.create({
      name: state.event.title,
      scheduledStartTime: state.event.startDate,
      scheduledEndTime: state.event.endDate,
      privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
      entityType: GuildScheduledEventEntityType.External,
      description: state.event.description,
      entityMetadata: {
        location: state.event.streamLink
      },
      image: state.event.image
    });

    return { id: createdEvent.id };
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.destroy();
  }
};

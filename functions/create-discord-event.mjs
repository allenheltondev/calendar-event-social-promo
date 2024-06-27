import { GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } from 'discord.js';
import { getDiscordClient } from './utils/helper.mjs';

export const handler = async (state) => {
  try {
    const client = await getDiscordClient();
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const events = await guild.scheduledEvents.fetch();
    const existingEvent = events.find(e => e.name === state.event.title);
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
  }
};

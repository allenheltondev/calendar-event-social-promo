import { getDiscordClient } from './utils/helper.mjs';

export const handler = async (state) => {
  try {
    const client = await getDiscordClient();
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    await guild.scheduledEvents.delete(state.discordId);

    return { success: true };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

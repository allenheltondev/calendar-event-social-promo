import Event from './models/event.mjs';
export const handler = async (state) => {
  try {
    await Event.delete(state.neonId);
    return { success: true };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

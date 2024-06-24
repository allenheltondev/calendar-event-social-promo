import Event from './models/event.mjs';
export const handler = async (state) => {
  try {
    const event = new Event();
    const data = {
      ...state.event,
      speakers: state.speakers
    };
    event.import(data);

    const detail = await event.save();
    return {
      eventId: detail.id,
      missingSpeakers: detail.missingSpeakers,
      hasMissingSpeakers: detail.missingSpeakers.length > 0,
      speakers: detail.speakers
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

import Event from './models/event.mjs';
export const handler = async (state) => {
  try {
    let event = await Event.findByTitle(state.event.title);
    if (event) {
      const speakers = await Event.loadSpeakers(event.id);
      const missingSpeakers = speakers.filter(s => !s.twitter || !s.discord);
      const speakerData = speakers.filter(s => s.twitter && s.discord);
      return {
        eventId: event.id,
        missingSpeakers,
        hasMissingSpeakers: missingSpeakers.length > 0,
        speakers: speakerData
      };
    }

    event = new Event();
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

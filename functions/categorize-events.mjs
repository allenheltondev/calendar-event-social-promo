import { unmarshall } from "@aws-sdk/util-dynamodb";
export const handler = async (state) => {
  try {
    const ddbEvents = state.ddbEvents.map(e => unmarshall(e));
    const newEvents = state.events.filter(e => !ddbEvents.find(ddb => ddb.pk === e.id));
    const deletedEvents = ddbEvents.filter(e => !state.events.find(event => event.id === e.pk)).map(e => {
      return {
        id: e.pk,
        campaign: e.neonId
      };
    });
    let updatedEvents = [];
    for (const event of state.events) {
      const ddb = ddbEvents.find(ddb => ddb.pk === e.id);
      if (!ddb) continue;

      if (ddb.date !== e.startDate) {
        updatedEvents.push({ ...event, campaign: e.neonId });
      }
    }

    return {
      newEvents,
      deletedEvents,
      updatedEvents
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

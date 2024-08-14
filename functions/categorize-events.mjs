import { unmarshall } from "@aws-sdk/util-dynamodb";
export const handler = async (state) => {
  try {
    const ddbEvents = state.ddbEvents.map(e => unmarshall(e));
    const newEvents = state.events.filter(e => !ddbEvents.find(ddb => ddb.pk === e.id));
    const deletedEvents = ddbEvents.filter(e => !state.events.find(event => event.id === e.pk)).map(e => {
      return {
        id: e.pk
      }
    });
    const updatedEvents = state.events.filter(e => {
      const ddb = ddbEvents.find(ddb => ddb.pk === e.id);
      if (!ddb) return false;
      return ddb.date !== e.startDate;
    });

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

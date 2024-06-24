import { SFNClient, SendTaskSuccessCommand } from '@aws-sdk/client-sfn';
import Event from "./models/event.mjs";

const sfn = new SFNClient();

export const handler = async (event) => {
  try {
    const { eventId } = event.pathParameters;
    const { token } = JSON.parse(event.body);
    const eventData = await Event.find(eventId);
    if (!eventData) {
      console.error(`Event with id ${eventId} not found`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Event not found' })
      };
    }

    const speakers = await Event.loadSpeakers(eventId);
    await sfn.send(new SendTaskSuccessCommand({
      output: JSON.stringify({ speakers, event: eventData }),
      taskToken: token
    }));

    return { statusCode: 204 };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong' })
    };
  }
};

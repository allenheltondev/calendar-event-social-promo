import Event from "./models/event.mjs";
import { createHashKey } from "./utils/helper.mjs";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
const events = new EventBridgeClient();

export const handler = async (event) => {
  try {
    const { eventId, missingSpeakers, token } = event.detail;

    const eventData = await Event.find(eventId);
    if (!eventData) {
      console.warn(`Event with id ${eventId} not found`);
    }

    const key = createHashKey(eventData);
    const html = getSpeakerFormHtml(eventData, missingSpeakers, token, key);
    await events.send(new PutEventsCommand({
      Entries: [
        {
          Detail: JSON.stringify({
            to: process.env.EMAIL,
            subject: '[BIS] Missing Speaker Data',
            html
          }),
          DetailType: "Send Email",
          Source: "speaker-data"
        }
      ]
    }));
  } catch (err) {
    console.error(err);
  }
};

const getSpeakerFormHtml = (event, missingSpeakers, token, key) => `
<div>
  <h2>Missing speaker information!</h2>
  <p>You are missing some speaker information for the upcoming event '<i>${event.title}</i>'. Please visit the link
below to fill out the missing information.
  </p>
  <ul>
    ${missingSpeakers.map(speaker => `<li>${speaker.name}</li>`).join('')}
  </ul>
  <p>
    <a href="${process.env.WEBSITE_URL}/events/${event.id}?token=${token}&key=${key}">Click here</a> to view missing information.
  </p>
  <p>
  Love,
  <br>
  The BIS Team
  </p>
</div>
`;

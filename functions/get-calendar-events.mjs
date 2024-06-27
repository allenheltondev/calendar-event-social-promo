import { google } from 'googleapis';
import { getSecret } from '@aws-lambda-powertools/parameters/secrets';

let secrets;
let calendar;

export const handler = async (state) => {
  try {
    await initializeCalendar();
    const response = await calendar.events.list({
      calendarId: state.calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items;
    const parsedEvents = events.map(e => {
      let image;
      if (e.attachments.length) {
        const images = e.attachments.filter(a => a.fileUrl.startsWith('https://drive.google.com') && a.mimeType.startsWith('image/'));
        if (images.length) {
          image = `https://drive.google.com/uc?export=view&id=${images[0].fileId}`;
        }
      }

      return {
        id: e.id,
        contact: e.creator.email,
        title: e.summary,
        streamLink: e.location,
        registrationLink: e.htmlLink,
        description: e.description,
        startDate: new Date(e.start.dateTime).toISOString(),
        endDate: new Date(e.end.dateTime).toISOString(),
        ...image && { image }
      };
    });
    return { events: parsedEvents };

  } catch (err) {
    console.error(err);
    throw err;
  }
};

const initializeCalendar = async () => {
  if (!secrets) {
    secrets = await getSecret(process.env.SECRET_ID, { transform: 'json' });
  }
  if(!calendar){
    calendar = google.calendar({ version: 'v3', auth: secrets.google });
  }
};


export const handler = async (state) => {
  try {
    const prompt = `Generate 5 social media posts each for Twitter, LinkedIn, and Discord for an upcoming ` +
      `event. These posts should encourage registration and get people excited about the content. ` +
      `The posts should vary in content and be created for when the event is 5 days away, 3 days ` +
      `away, 1 day away, 30 minutes away, and starting now. It is ${new Date().toISOString()} right ` +
      `now. Extract details from the following ` +
      `event JSON and use it to build engaging posts. Be upbeat, use minimal emojis and zero hashtags, and provide a ` +
      `positive vibe that promotes a sense of community. Build anticipation and encourage ` +
      `followers to attend as the event gets closer. All posts must include a link at the end of the message. ` +
      `The only posts that should include the streamLink is the 30 minutes before post and the start of the ` +
      `event post. All others must include the registrationLink. Instead of saying to register for the event ` +
      `say something like "mark your calendars". Use the speaker's name and do not attempt to ` +
      `tag them. Create the posts with relevant tone for all social platforms. Use the UTC startTime ` +
      `of the event to choose an appropriate sendAtDate for each post. If the event has an image, ` +
      `include it in the post object for the 5, 3, and 1 day out posts. Respond only with JSON. Event: ` +
      `${JSON.stringify(state.event, null, 2)} `;

    return { prompt, schema: getSchema() };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getSchema = () => {
  return {
    "$schema": "http://json-schema.org/draft-07/schema#",
    type: 'object',
    properties: {
      linkedin: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            sendAtDate: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time to send the post in YYYY-MM-DDTHH:MM:SS format in UTC'
            },
            image: {
              type: 'string'
            }
          },
          required: ['message', 'sendAtDate']
        },
        maxItems: 5
      },
      twitter: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            sendAtDate: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time to send the post in YYYY-MM-DDTHH:MM:SS format in UTC'
            },
            image: {
              type: 'string'
            }
          },
          required: ['message', 'sendAtDate']
        },
        maxItems: 5
      },
      discord: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            sendAtDate: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time to send the post in YYYY-MM-DDTHH:MM:SS format in UTC'
            },
            image: {
              type: 'string'
            }
          },
          required: ['message', 'sendAtDate']
        },
        maxItems: 5
      }
    },
    required: ['linkedin', 'twitter', 'discord']
  };
};

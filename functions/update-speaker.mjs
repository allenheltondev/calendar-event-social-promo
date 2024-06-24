import Speaker from "./models/speaker.mjs";
export const handler = async (event) => {
  try {
    const { speakerId } = event.pathParameters;
    const { twitter, discord } = JSON.parse(event.body);
    const speaker = new Speaker();
    await speaker.load(speakerId);
    speaker.twitter = twitter;
    speaker.discord = discord;

    await speaker.save();
    return {
      statusCode: 204
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong' })
    };
  }
};

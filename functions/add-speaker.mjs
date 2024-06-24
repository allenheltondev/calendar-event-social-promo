import Speaker from "./models/speaker.mjs";
export const handler = async (event) => {
  try {
    const speaker = new Speaker();
    speaker.import(event.body);
    const { id } = await speaker.save();

    return {
      statusCode: 201,
      body: JSON.stringify({ id })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong' })
    };
  }
};

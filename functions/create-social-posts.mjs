import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
const bedrock = new BedrockRuntimeClient();
const MODEL_ID = 'anthropic.claude-3-sonnet-20240229-v1:0';

export const handler = async (state) => {
  try {
    const prompt = getPrompt(state.event);
    console.log(prompt);
    const response = await bedrock.send(new InvokeModelCommand({
      modelId: MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        max_tokens: 100000,
        anthropic_version: "bedrock-2023-05-31",
        messages: [
          {
            role: "user",
            content: [{
              type: "text",
              text: prompt
            }]
          }
        ]
      })
    }));

    const rawData = new TextDecoder().decode(response.body);
    const answer = JSON.parse(rawData);
    const aiResponse = answer.content[0].text;

    const match = aiResponse.match(/<result>([\s\S]*?)<\/result>/);
    if (match) {
      const resultContent = match[1].trim();
      return { result: JSON.parse(resultContent) };
    } else {
      console.warn(completion);
      throw new AIError('Did not receive expected response');
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getPrompt = (event) => {
  const prompt = `You will be generating social media posts to promote an upcoming event on LinkedIn and Twitter. I will provide you with a JSON object containing key details about the event. Your task is to create engaging posts for both platforms at the following intervals before the event start time:
- 5 days before
- 3 days before
- 1 day before
- 30 minutes before
- Start of the event

Here is the event JSON:
<event>
${JSON.stringify(event, null, 2)}
</event>

Please carefully extract the relevant event details from this JSON, including the event title, description, start date/time, registration link, and image.

Your posts must meet all of the following criteria, no exceptions:
- Do not mention people's usernames using @ in the posts, only use their names.
- Vary in content and tone to be appropriate for LinkedIn vs Twitter audiences
- Include the key event details extracted from the JSON in an engaging way
- Be upbeat, use minimal emojis, and provide a positive vibe that promotes a sense of community
- Build anticipation and encourage followers to attend as the event gets closer
- The only posts that should include the streamLink is the 30 minutes before post and the start of the event post. All others should include the registrationLink
- Do not create posts that would be scheduled before today's date

Before generating your final posts, first brainstorm some ideas for post content and format in the scratchpad below:
Now generate an object containing two arrays, "linkedin" and "twitter". Each array should contain 5 json objects, one per post, in chronological order. Each post object should have a "message" property with the text of the post, a "sendAtDate" property with the date/time the post should be sent in UTC in YYYY-MM-DDTHH:MM:SS format, and an optional "image" property if the event contains an image.

Write your final response inside <result> tags.`;

  return prompt;
};

class AIError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidAIResponse';
  }
};

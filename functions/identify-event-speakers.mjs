import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
const bedrock = new BedrockRuntimeClient();
const MODEL_ID = 'anthropic.claude-3-haiku-20240307-v1:0';

export const handler = async (state) => {
  try{
    const prompt = `Identify the speakers in this description for an event. Return your answer as a comma separated list in a <speakers> tag.
      <description>${state.eventDescription}</description>`;
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

    const answer = JSON.parse(new TextDecoder().decode(response.body));
    const aiResponse = answer.content[0].text;

    const match = aiResponse.match(/<speakers>(.*?)<\/speakers>/)[1];
    if (match) {
      const speakers = match.split(',').map(s => s.trim());
      return { speakers };
    } else {
      console.warn(completion);
      throw new AIError('Did not receive expected response');
    }
  } catch(err) {
    console.error(err);
    throw err;
  }
}

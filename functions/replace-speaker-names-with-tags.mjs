export const handler = async (state) => {
  return {
    twitter: processTwitterMessages(state.speakers, state.messages.twitter),
    discord: processDiscordMessages(state.speakers, state.messages.discord),
    linkedin: processLinkedInMessages(state.speakers, state.messages.linkedin)
  };
};

const processTwitterMessages = (speakers, twitter) => {
  const messages = [];

  for (const message of twitter) {
    let msg = message.message;
    for (const speaker of speakers) {
      if (speaker.twitter) {
        const regex = new RegExp(speaker.name, 'g');
        msg = msg.replace(regex, `@${speaker.twitter}`);
      }
    }

    messages.push({
      message: msg,
      sendAtDate: message.sendAtDate,
      ...message.image && { image: message.image }
    });
  }

  return messages;
};

const processDiscordMessages = (speakers, discord) => {
  const messages = [];

  for (const message of discord) {
    let msg = message.message;
    for (const speaker of speakers) {
      if (speaker.discord) {
        const regex = new RegExp(speaker.name, 'g');
        msg = msg.replace(regex, `<@${speaker.discord}>`);
      }
    }

    messages.push({
      message: msg,
      sendAtDate: message.sendAtDate,
      ...message.image && { image: message.image }
    });
  }

  return messages;
};

const processLinkedInMessages = (speakers, linkedin) => {
  // Not supported quite yet, pass back the input

  return linkedin;
};

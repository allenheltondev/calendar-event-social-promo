export const handler = async (state) => {
  const twitterMessages = formatPosts('twitter', state.posts.twitter);
  const linkedInMessages = formatPosts('linkedin', state.posts.linkedin);
  const discordMessages = formatPosts('discord', state.posts.discord);
  const messages = [
    ...twitterMessages,
    ...linkedInMessages,
    ...discordMessages
  ];
  return { messages };
};

const formatPosts = (platform, messages) => {
  const now = new Date();
  const posts = [];

  for (const message of messages) {
    const date = new Date(message.sendAtDate);
    if (date < now) continue;

    posts.push({
      scheduledDate: date.toISOString().split('.')[0],
      platform,
      accountId: process.env.ACCOUNT_ID,
      message: message.message,
      ...message.image && { image: message.image }
    });
  }

  return posts;
};

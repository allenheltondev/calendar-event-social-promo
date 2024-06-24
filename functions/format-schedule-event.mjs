export const handler = async (state) => {
  const now = new Date();
  const messages = [];
  for (const tweet of state.posts.twitter) {
    const date = new Date(tweet.sendAtDate);
    if (date < now) continue;

    messages.push({
      scheduledDate: date.toISOString().split('.')[0],
      platform: 'twitter',
      accountId: process.env.ACCOUNT_ID,
      message: tweet.message,
      ...tweet.image && { image: tweet.image }
    });
  }

  for (const linkedInPost of state.posts.linkedin) {
    const date = new Date(linkedInPost.sendAtDate);
    if (date < now) continue;

    messages.push({
      scheduledDate: date.toISOString().split('.')[0],
      platform: 'linkedin',
      accountId: process.env.ACCOUNT_ID,
      message: linkedInPost.message,
      ...linkedInPost.image && { image: linkedInPost.image }
    });
  }

  return { messages };
};

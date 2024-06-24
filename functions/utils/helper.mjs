import crypto from 'crypto';

export const createHashKey = (data) => {
  const payload = JSON.stringify(data);
  const hmac = crypto.createHmac('sha256', process.env.HMAC_SECRET);
  hmac.update(payload);

  return hmac.digest('hex');
};

export const verifyHashKey = (data, hashKey) => {
  const key = createHashKey(data);

  console.log(key);
  console.log(hashKey);
  return key === hashKey;
};

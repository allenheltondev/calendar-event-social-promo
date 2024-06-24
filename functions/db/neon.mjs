import { neon } from "@neondatabase/serverless";
import { getSecret } from '@aws-lambda-powertools/parameters/secrets';

let sql;

export const query = async (command, parameters) => {
  await initialize();

  return await sql(command, parameters);
};

const initialize = async () => {
  if (sql) return;

  const secrets = await getSecret(process.env.SECRET_ID, { transform: 'json' });
  sql = neon(secrets.neon);
};

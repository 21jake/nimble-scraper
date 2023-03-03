import * as dotenv from 'dotenv';

dotenv.config();

const { APP_PORT, DATABASE_NAME, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, JWT_KEY } =
  process.env;

export const appEnv = {
  APP_PORT: Number(APP_PORT),
  DATABASE_NAME,
  DATABASE_PORT: Number(DATABASE_PORT),
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  SALT_ROUNDS: 10,
  JWT_KEY,
};

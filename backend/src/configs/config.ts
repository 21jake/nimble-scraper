import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const { APP_PORT, DATABASE_NAME, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, JWT_KEY } =
  process.env;

const STORAGE_PATH = path.join(__dirname, '../..', '/storage');
const HTML_CACHE_PATH = path.join(STORAGE_PATH, '/html');
const CSV_PATH = path.join(STORAGE_PATH, '/csv');


export const appEnv = {
  APP_PORT: Number(APP_PORT),
  DATABASE_NAME,
  DATABASE_PORT: Number(DATABASE_PORT),
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  SALT_ROUNDS: 10,
  JWT_KEY,
  HTML_CACHE_PATH,
  CSV_PATH,
};

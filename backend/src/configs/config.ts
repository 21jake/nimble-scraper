import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const { APP_PORT, DATABASE_NAME, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, JWT_KEY } =
  process.env;

const STORAGE_PATH = path.join(__dirname, '../..', '/storage');
const HTML_CACHE_PATH = path.join(STORAGE_PATH, '/html');
const CSV_PATH = path.join(STORAGE_PATH, '/csv');
const PROXY_FILE_PATH = path.join(__dirname, '../..', '/proxies.json');


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
  PROXY_FILE_PATH,
  CHUNK_SIZE: 3,
  DELAY_BETWEEN_CHUNK_MS: 5_000,
  PAGE_TIMEOUT_MS: 10_000,
};

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const { APP_PORT, DATABASE_NAME, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, JWT_KEY, NODE_ENV } =
  process.env;

const STORAGE_PATH = path.join(__dirname, '../..', '/storage');
const HTML_CACHE_PATH = path.join(STORAGE_PATH, '/html');
const CSV_PATH = path.join(STORAGE_PATH, '/csv');
const PROXY_FILE_PATH = path.join(__dirname, '../..', '/proxies.json');
const SAMPLES_PATH = path.join(__dirname, '../..', '/test/samples');


export const appEnv = {
  APP_PORT: Number(APP_PORT),
  IS_PROD: NODE_ENV === 'prod',
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
  MAX_KEYWORDS_PER_BATCH: 100,
  MAX_FILE_SIZE_BYTE: 100 * 1024,
  APP_DATE_FORMAT: 'HH:mm - DD/MM/YY',
  SAMPLES_PATH,
  CRON_RESCRAPE_SIZE: 10
};

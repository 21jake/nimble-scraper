import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import * as path from 'path';

dotenv.config();

const { APP_PORT, DATABASE_NAME, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, JWT_KEY, NODE_ENV } =
  process.env;

const STORAGE_PATH = path.join(__dirname, '../..', '/storage');
const HTML_CACHE_PATH = path.join(STORAGE_PATH, '/html');
const CSV_PATH = path.join(STORAGE_PATH, '/csv');
const PROXY_FILE_PATH = path.join(__dirname, '../..', '/proxies.json');

const proxiesCount = Number(JSON.parse(readFileSync(PROXY_FILE_PATH, 'utf-8')).length);
const CHUNK_SIZE = 4 // Number of keywords scraped at a time

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
  CHUNK_SIZE,
  DELAY_BETWEEN_CHUNK_MS: 4_000,
  PAGE_TIMEOUT_MS: 10_000,
  MAX_CONCURRENT_UPLOAD: Math.round(proxiesCount / CHUNK_SIZE) - 1
};

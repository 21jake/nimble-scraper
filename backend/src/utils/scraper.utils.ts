import { readFile, readFileSync, writeFileSync } from 'fs';
import { first } from 'lodash';
import { appEnv } from 'src/configs/config';

interface IProxy {
  url: string;
  count: number;
  label: string;
}

/**
 * Pick the least used proxy from at the first index of the proxies array
 * Then increase the count of the proxy by 1
 * Then sort the proxies by count
 * @returns {Promise<string>} - The least used proxy url
 */

export const pickLeastUsedProxy = async () => {
  const proxies: IProxy[] = JSON.parse(readFileSync(appEnv.PROXY_FILE_PATH, { encoding: 'utf-8' }));

  const leastUsed = first(proxies);

  const sortedProxies = proxies
    .map((proxy) => {
      if (proxy === leastUsed) {
        proxy.count += 1;
      }
      return proxy;
    })
    .sort((a, b) => a.count - b.count);

  await writeFileSync(appEnv.PROXY_FILE_PATH, JSON.stringify(sortedProxies, null, 2));
  return leastUsed.url;
};

export const extractSearchPerfFromRawResult = (rawResult: string) => {
  // Khoảng 861.000 kết quả (0,72 giây)
  const [rawTotalResults, rawSearchTime] = rawResult.split(`(`);
  const searchTime = rawSearchTime.split(` `)[0];

  const stripNonNumeric = /[^0-9]/g;
  const totalResults = rawTotalResults.replace(stripNonNumeric, '');

  return { searchTime, totalResults };
};

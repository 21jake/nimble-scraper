import puppeteer, { Browser, Page } from 'puppeteer';
import { readFile, readFileSync, writeFileSync } from 'fs';
import { first } from 'lodash';
import { appEnv } from 'src/configs/config';
import dayjs from 'dayjs';
import path from 'path';

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
  return leastUsed;
};

export class SinglePageManipulator {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  public async writeToFile(keyword: string) {
    const fileName = `${keyword}-${dayjs().unix()}.html`;
    const htmlContent = await this.page.content();
    await writeFileSync(path.join(appEnv.HTML_CACHE_PATH, fileName), htmlContent);
    return fileName;
  }

  public async getTotalAnchorLinks() {
    const totalAnchorLinks = await this.page.$$eval('a', (links) => links.length);
    return totalAnchorLinks;
  }

  public async getAdsCount() {
    // 1. <div> with data-text-ad="1"
    // 2. <div> with class "pla-unit-title"
    const textAdCount = await this.page.$$eval('div[data-text-ad="1"]', (links) => links.length);
    const plaAdCount = await this.page.$$eval('div.pla-unit-title', (links) => links.length);
    const adsCount = textAdCount + plaAdCount;
    return adsCount;
  }

  public async getSearchPerf(): Promise<{ searchTime: string; totalResults: string }> {
    let resultStats, searchTime, totalResults;
    try {
      // If no element is found matching selector, the method will throw an error. 
      resultStats = await this.page.$eval('div#result-stats', (el) => el.textContent);
    } catch (error) {
      resultStats = null;
    }
    if (resultStats) {
      const extracted = this.extractSearchPerfFromRawResult(resultStats);
      searchTime = extracted.searchTime;
      totalResults = extracted.totalResults;
    }
    return { searchTime, totalResults };
  }

  private extractSearchPerfFromRawResult = (rawResult: string) => {
    // Khoảng 861.000 kết quả (0,72 giây)
    const [rawTotalResults, rawSearchTime] = rawResult.split(`(`);
    const [searchTime] = rawSearchTime.split(` `);

    const stripNonNumeric = /[^0-9]/g;
    const totalResults = rawTotalResults.replace(stripNonNumeric, '');

    return { searchTime, totalResults };
  };
}

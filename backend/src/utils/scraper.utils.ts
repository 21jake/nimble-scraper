import axios, { AxiosProxyConfig, AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import { readFileSync, writeFileSync } from 'fs';
import { first } from 'lodash';
import path from 'path';
import { appEnv } from 'src/configs/config';
import * as cheerio from 'cheerio';
interface IProxy {
  url: string;
  count: number;
  label: string;
  username: string;
  protocol: string;
  pw: string;
  host: string;
  port: number;
}

/**
 * Pick the least used proxy from at the first index of the proxies array
 * Then increase the count of the proxy by 1
 * Then sort the proxies by count
 * @returns {Promise<IProxy>} - The least used proxy
 */

export const pickLeastUsedProxy = () => {
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

  writeFileSync(appEnv.PROXY_FILE_PATH, JSON.stringify(sortedProxies, null, 2));
  return leastUsed;
};

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 12.6; rv:106.0) Gecko/20100101 Firefox/106.0',
  'Mozilla/5.0 (X11; Linux i686; rv:106.0) Gecko/20100101 Firefox/106.0',
  'Mozilla/5.0 (X11; Linux x86_64; rv:106.0) Gecko/20100101 Firefox/106.0',
  'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:106.0) Gecko/20100101 Firefox/106.0',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:106.0) Gecko/20100101 Firefox/106.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edge/106.0.1370.47',
];

function randomUserAgent(): string {
  const randomIndex = Math.floor(Math.random() * USER_AGENTS.length);
  return USER_AGENTS[randomIndex];
}

export class HttpScraper {
  private keyword: string;

  private cheerioAPI: cheerio.CheerioAPI;

  public proxy: IProxy;

  // private baseUrl: string;
  private axiosConfig: AxiosRequestConfig;

  constructor(kw: string) {
    this.keyword = kw.replaceAll(' ', '+');

    this.proxy = pickLeastUsedProxy();
    let axiosProxy: AxiosProxyConfig | undefined;
    if (this.proxy.url) {
      axiosProxy = {
        host: this.proxy.host,
        port: this.proxy.port,
        protocol: this.proxy.protocol,
        auth: {
          username: this.proxy.username,
          password: this.proxy.pw,
        },
      };
    }

    this.axiosConfig = {
      method: 'GET',
      url: `https://www.google.com/search?q=${this.keyword}`,
      headers: {
        'User-Agent': randomUserAgent(),
      },
      proxy: axiosProxy,
    };
  }

  public async scrape() {
    const response = await axios(this.axiosConfig);
    this.cheerioAPI = cheerio.load(response.data);
    return response;
  }

  public getOverviewScrapedInfo() {

    if (!this.cheerioAPI) {
      throw new Error('No data scraped yet!');
    }

    // Check if html contains captcha
    const captcha = this.cheerioAPI('form#captcha-form').length;
    if (captcha) {
      throw new Error('Captcha-ed');
    }

    const fileName = this.writeToFile();
    const totalAnchorLinks = this.getTotalAnchorLinks();
    const adsCount = this.getAdsCount();
    const { searchTime, totalResults } = this.getSearchPerf();
    return {
      totalAnchorLinks,
      adsCount,
      searchTime,
      totalResults,
      fileName,
    };
  }

  private writeToFile() {
    const html = this.cheerioAPI('html').html();
    const fileName = `${this.keyword}-${dayjs().unix()}.html`;
    writeFileSync(path.join(appEnv.HTML_CACHE_PATH, fileName), html);
    return fileName;
  }

  private getTotalAnchorLinks() {
    const totalAnchorLinks = this.cheerioAPI('a').length;
    return totalAnchorLinks;
  }

  private getAdsCount() {
    // 1. <div> with data-text-ad="1"
    // 2. <div> with class "pla-unit-title"
    const textAdCount = this.cheerioAPI('div[data-text-ad="1"]').length;
    const plaAdCount = this.cheerioAPI('div.pla-unit-title').length;
    const adsCount = textAdCount + plaAdCount;
    return adsCount;
  }

  private getSearchPerf(): { searchTime: string; totalResults: string } {
    let searchTime, totalResults;

    const resultStats = this.cheerioAPI('div#result-stats').text();
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

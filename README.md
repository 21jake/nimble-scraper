# nimble-scraper
The tool: http://skrape.site/

### Tech stacks:
- Frontend: ReactJS/Redux, Bootstrap, CoreUI template.
- Backend: NestJS, Puppeteer.
- Deployment: Git, Docker, Compose.
- Test: Jest (~80% coverage)

Uploaded CSV will get their keywords parsed. Keywords are divided into chunks of three, which means **3** keywords are scraped at a time. Increasing this chunk size leads to more frequent errors. Scraped results are streamed back to frontend using Server-sent events.

I use static proxies rotating for each request to bypass Google mass searching detection. To ensure the longevity of the proxies, a delay is needed between each chunk.

Average time to search for 100 keywords is about 50 seconds. Currently a 2-CPU 4GB Ubuntu server can handle up to 4 concurrent uploads before showing sign of scraping failure (Captcha-ed, Timeout, etc).

### Difficulties and potential fixes
- This [bug](https://github.com/Cuadrix/puppeteer-page-proxy/issues/76) causes unexpected server crashes (which might in turn lead to frontend app freezes during streaming). The library is needed for proxifying the requests.  I haven't found a workaround.

- Streaming scraped data to frontend feels slow. I might try to employ a Captcha solver service to somehow speed the scraping process.

- The streaming data to frontend is unoptimized. Unnecessary calls and duplicative payload.

- Develop a "re-try" logic to re-scrape failed keyword.

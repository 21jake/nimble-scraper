# nimble-scraper
**Available at**: http://skrape.site/

### Tech stacks:
- Frontend: ReactJS/Redux, Bootstrap, CoreUI template.
- Backend: NestJS, Puppeteer.
- Deployment: Git, Docker, Compose.
- Test: Jest (~80% coverage)

Uploaded CSVs will get their keywords parsed. Keywords are divided into chunks of three, which means **3** keywords are scraped at a time. Increasing this chunk size leads to more frequent errors. Scraped results are continously streamed back to frontend using Server-sent events.

I use static proxies rotating for each request to bypass Google mass searching detection. To ensure the longevity of the proxies, a delay is needed between each chunk.

Average time to finish a "batch" of 100 keywords is about 4 minutes. Currently a 2-CPU 4GB Ubuntu server with 22 proxies can handle up to 7 concurrent uploads before showing sign of scraping failures (Captcha-ed, Timeout, etc).

In case of failure, error messages are recorded. A cron service will periodically check for failed keywords and re-scrape them.

### Run locally: 

- Open terminal at the root directory.
- Run 
    - <code>docker-compose -f docker-compose.yml -f docker-compose.local.yml pull backend frontend </code>
    - <code>docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d </code>
- You might have to wait a bit for the containers to start up.
- The frontend app should be available at your http://localhost

### Difficulties and potential fixes
- This [bug](https://github.com/Cuadrix/puppeteer-page-proxy/issues/76) causes unexpected server crashes (which might in turn lead to frontend app freezes during streaming). The library is needed for proxifying the requests.

- Streaming scraped data to frontend feels slow. I might try to employ a Captcha solver service to somehow speed the scraping process.

- The streaming data to frontend is unoptimized. Unnecessary calls and duplicative payload.

- Reduce the size of Docker image and adding database healthcheck.

- More robust with searching/sorting/filtering scraped data.
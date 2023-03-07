# nimble-scraper
The tool: http://skrape.site/

Tech stacks used to make this tool possible:
- Frontend: ReactJS/Redux, Bootstrap, CoreUI template.
- Backend: NestJS, Puppeteer.
- Deployment: Git, Docker, Compose.

Keywords are divided into chunks of three, which means **3** keywords are scraped at a time. Increasing this chunk size leads to more frequent errors. Scraped results are streamed back to frontend using Server-sent events.

I use static proxies rotating for each request to bypass Google mass searching detection. To ensure the longevity of the proxies, a delay is needed between each chunk.

Average time to search for 100 keywords is about 50 seconds. Currently a 2-CPU 4GB Ubuntu server can handle up to 4 concurrent uploads before showing sign of errors (Captcha-ed, Timeout, etc).

Difficulties and potential fixes
- This [bug](https://github.com/Cuadrix/puppeteer-page-proxy/issues/76) causes unexpected server crashes (which might in turn lead to frontend app freezes during streaming). The library is needed for proxifying the requests.  I haven't found a workaround.

- Streaming scraped data to client app feels slow. I might try to employ a Captcha solver service to somehow speed the scraping process.

- The streaming data to client app is unoptimized. Unnecessary calls and duplicative payload.

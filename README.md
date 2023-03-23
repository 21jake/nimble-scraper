# nimble-scraper
**Available at**: http://skrape.site/

### Tech stacks:
- Frontend: ReactJS/Redux, Bootstrap, CoreUI template.
- Backend: NestJS, Axios, Cheerio.
- Deployment: Git, Docker, Compose.
- Test: Jest (~80% coverage)

Uploaded CSVs will get their keywords parsed. Keywords are scraped using proxified HTTP requests. Scraped results are continously streamed back to frontend using Server-sent events to provide near-immediate feedbacks.

I use static proxies rotating for each request to bypass Google mass searching detection. Average time to finish a "batch" of 100 keywords is about 90 seconds.

In case of failure (Network timeout, Captcha, etc), error messages are recorded. A cron service will periodically check for failed keywords and re-scrape them.

### Run locally: 

- Open terminal at the root directory.
- Run 
    - <code>docker-compose -f docker-compose.yml -f docker-compose.local.yml pull backend frontend </code>
    - <code>docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d </code>
- You might have to wait a bit for the containers to start up.
- The frontend app should be available at your http://localhost:3001

### Difficulties and potential fixes
- The streaming data to frontend is unoptimized. ~~Unnecessary calls and~~ duplicative payload.

- ~~Reduce the size of Docker image~~ and adding database healthcheck.

- More robust with searching/sorting/filtering scraped data.
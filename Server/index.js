const express = require("express");
const app = express();
const router = express.Router();
const { Parser } = require("json2csv");
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 28800 }); // 8 hours
const port = process.env.PORT || 3000; // You can use environment variables for port configuration

function getCacheKey(team_id, event_id, gender) {
  return `${team_id}-${event_id}-${gender}`;
}

app.get("/", (req, res) => {
  try {
    res.send("<h1>This is the API for SplashStats</h1>");
  } catch (error) {
    next(error);
  }
});

app.get("/team_id/:team/event_id/:event/gender/:gender", async (req, res) => {
  try {
    console.log("Request received");
    console.log(req.params);

    const team_id = parseInt(req.params.team);
    const event_id = parseInt(req.params.event);
    const gender = req.params.gender;

    console.log("Checking Cache...");
    const cacheKey = getCacheKey(team_id, event_id, gender);
    const value = myCache.get(cacheKey);
    if (value == undefined) {
      console.log("Cache miss...");
      console.log("Scraping event data...");

      // Dynamically import the scrapeEvent function
      const { scrapeEvent } = await import("./scraper/scrape.mjs");

      const data = await scrapeEvent(event_id, gender, team_id);

      console.log("Setting cache...");
      myCache.set(cacheKey, data);

      res.json(data);
    } else {
      console.log("Cache hit...");
      res.json(value);
    }
  } catch (error) {
    next(error);
  }
});

app.get("/team_id/:team", async (req, res) => {
  try {
    console.log("Request received");
    console.log(req.params);

    const team_id = parseInt(req.params.team);

    console.log("Checking Cache...");
    const cacheKey = getCacheKey(team_id, "ALL", "ALL");
    const value = myCache.get(cacheKey);
    if (value == undefined) {
      console.log("Cache miss...");
      console.log("Scraping team data...");

      // Dynamically import the scrapeTeam function
      const { scrapeTeam } = await import("./scraper/scrape.mjs");

      const data = await scrapeTeam(team_id);

      console.log("Setting cache...");
      myCache.set(cacheKey, data);

      res.json(data);
    } else {
      console.log("Cache hit...");
      res.json(value);
    }
  } catch (error) {
    next(error);
  }
});

app.get("/download-csv/:team_id", async (req, res) => {
  try {
    console.log(req.params);

    const team_id = parseInt(req.params.team_id);

    console.log("Checking Cache...");
    const cacheKey = getCacheKey(team_id, "ALL", "ALL");
    const value = myCache.get(cacheKey);

    let data;
    if (value == undefined) {
      console.log("Scraping team data...");

      // Dynamically import the scrapeTeam function
      const { scrapeTeam } = await import("./scraper/scrape.mjs");

      data = await scrapeTeam(team_id);
    } else {
      console.log("Cache hit...");
      data = value;
    }

    const json2csv = new Parser();
    const csv = json2csv.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("data.csv");
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = router;

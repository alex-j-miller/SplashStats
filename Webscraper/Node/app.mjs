import puppeteer from "puppeteer";
import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

function writeCsv(data) {
  const csvWriter = createObjectCsvWriter({
    path: "output.csv",
    header: [
      { id: "rank", title: "Rank" },
      { id: "name", title: "Name" },
      { id: "meet", title: "Meet" },
      { id: "time", title: "Time" },
      { id: "seconds", title: "Time in Seconds" },
      { id: "flags", title: "Flags" },
    ],
  });

  csvWriter
    .writeRecords(data)
    .then(() => {
      console.log("...Done");
    })
    .catch((error) => {
      console.error("Error writing CSV:", error);
    });
}

async function scrapeTable(url, tableSelector) {
  // Launch a new browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the URL
  await page.goto(url);

  // Wait for the table to load
  await page.waitForSelector(tableSelector, { timeout: 3000 });

  // Extract data from the table
  const data = await page.evaluate((tableSelector) => {
    const rows = Array.from(document.querySelectorAll(`${tableSelector} tr`));
    return rows.map((row) => {
      const cells = Array.from(row.querySelectorAll("th, td"));
      return cells.map((cell) => cell.innerText.trim());
    });
  }, tableSelector);

  // Close the browser
  await browser.close();

  return data;
}

function getCurrentSeasonId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return getSeasonId(month >= 8 ? year : year - 1);
}

function getSeasonId(year) {
  return year - 1996;
}

function arrayToObjects(array) {
  let [headers, ...rows] = array;
  headers = ["rank", "name", "meet", "time", "flags"];
  return rows.map((row) => {
    return headers.reduce((obj, header, index) => {
      obj[header] = row[index];
      return obj;
    }, {});
  });
}

function minutesToSeconds(time) {
  // Split the time string by ':' to check if it contains minutes
  const parts = time.split(":");

  if (parts.length === 2) {
    // If there are two parts, we have minutes and seconds
    const minutes = parseInt(parts[0]);
    const seconds = parseFloat(parts[1]);
    return minutes * 60 + seconds;
  } else if (parts.length === 1) {
    // If there's only one part, we have only seconds
    return parseFloat(parts[0]);
  } else {
    throw new Error("Invalid time format");
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getEventName(eventId) {
  const events = {
    150: "50 Free",
    1100: "100 Free",
    1200: "200 Free",
    1500: "500 Free",
    11000: "1000 Free",
    11650: "1650 Free",
    250: "50 Back",
    2100: "100 Back",
    2200: "200 Back",
    350: "50 Breast",
    3100: "100 Breast",
    3200: "200 Breast",
    450: "50 Fly",
    4100: "100 Fly",
    4200: "200 Fly",
    5100: "100 IM",
    5200: "200 IM",
    5400: "400 IM",
  };

  return events[eventId];
}

async function scrapeAll() {
  let times = [];

  const events = [
    150, // 50 Free
    1100, // 100 Free
    1200, // 200 Free
    1500, // 500 Free
    11000, // 1000 Free
    11650, // 1650 Free
    250, // 50 Back
    2100, // 100 Back
    2200, // 200 Back
    350, // 50 Breast
    3100, // 100 Breast
    3200, // 200 Breast
    450, // 50 Fly
    4100, // 100 Fly
    4200, // 200 Fly
    5100, // 100 IM
    5200, // 200 IM
    5400, // 400 IM
  ];

  const genders = ["M", "F"];

  const season_id = getCurrentSeasonId();

  // Usage
  const tableSelector = "table"; // Replace with the CSS selector for the table

  for (const event of events) {
    for (const gender of genders) {
      console.log(
        `Scraping event: ${event} for gender: ${gender} and season: ${season_id}`
      );
      let url = `https://www.swimcloud.com/team/55/times/?dont_group=false&event=${event}&event_course=Y&gender=${gender}&page=1&region&season_id=${season_id}&tag_id&team_id=55&year=2024`;

      if (event === 11650) {
        console.log(url);
      }

      await scrapeTable(url, tableSelector)
        .then((data) => {
          data = arrayToObjects(data);

          for (const row of data) {
            row.seconds = minutesToSeconds(row.time);
            row.event_Id = event;
            row.event = getEventName(event);
          }

          times = times.concat(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error scraping table:", error);
        });
    }
    await sleep(3000);
  }
  await writeCsv(times);
  await stopTimer();
}

/* 
  The code below is responsible for timing the execution of the script.
  It is not necessary for the scraping functionality.
*/

let time = 0;

function updateTimer() {
  time++;
}

const timer = setInterval(updateTimer, 100);

function stopTimer() {
  clearInterval(timer);
  console.log("Time elapsed:", time / 10, "seconds");
}

scrapeAll();

// https://www.swimcloud.com/team/55/times/?dont_group=false&event=11650&event_course=Y&gender=M&page=1&region&season_id=27&tag_id&team_id=55&year=2024
// https://www.swimcloud.com/team/55/times/?dont_group=false&event=11650&event_course=Y&gender=M&page=1&region&season_id=27&tag_id&team_id=55&year=2024
// https://www.swimcloud.com/team/55/times/?dont_group=false&event=11650&event_course=Y&gender=M&page=1&region&season_id=27&tag_id&team_id=55

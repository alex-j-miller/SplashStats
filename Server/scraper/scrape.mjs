import puppeteer from "puppeteer";
import { createObjectCsvWriter } from "csv-writer";
// import { get } from "../server";

function writeCsv(data) {
  const csvWriter = createObjectCsvWriter({
    path: "../../public/output.csv",
    header: [
      { id: "rank", title: "Rank" },
      { id: "name", title: "Name" },
      { id: "meet", title: "Meet" },
      { id: "time", title: "Time" },
      { id: "seconds", title: "Time in Seconds" },
      { id: "flags", title: "Flags" },
      { id: "event_Id", title: "Event ID" },
      { id: "event", title: "Event" },
      { id: "gender", title: "Gender" },
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
  await page.waitForSelector(tableSelector, { timeout: 10000 });

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
  return getSeasonId(month >= 9 ? year : year - 1);
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

function getEventId(eventName) {
  const events = {
    "50 Free": 150,
    "100 Free": 1100,
    "200 Free": 1200,
    "500 Free": 1500,
    "1000 Free": 11000,
    "1650 Free": 11650,
    "50 Back": 250,
    "100 Back": 2100,
    "200 Back": 2200,
    "50 Breast": 350,
    "100 Breast": 3100,
    "200 Breast": 3200,
    "50 Fly": 450,
    "100 Fly": 4100,
    "200 Fly": 4200,
    "100 IM": 5100,
    "200 IM": 5200,
    "400 IM": 5400,
  };
  return events[eventName];
}

export async function scrapeTeamCSV(team_id) {
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
  // const team_id = 55;
  const season_id = getCurrentSeasonId();

  // Usage
  const tableSelector = "table"; // Replace with the CSS selector for the table

  for (const event of events) {
    for (const gender of genders) {
      console.log(
        `Scraping event: ${event} for gender: ${gender} and season: ${season_id}`
      );
      let url = `https://www.swimcloud.com/team/${team_id}/times/?dont_group=false&event=${event}&event_course=Y&gender=${gender}&page=1&region&season_id=${season_id}&tag_id&team_id=${team_id}&year=2024`;

      // if (event === 11650) {
      console.log(url);
      // }

      await scrapeTable(url, tableSelector)
        .then((data) => {
          data = arrayToObjects(data);

          for (const row of data) {
            row.seconds = minutesToSeconds(row.time);
            row.event_Id = event;
            row.event = getEventName(event);
            row.gender = gender === "M" ? "Male" : "Female";
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
}

export async function scrapeTeam(team_id) {
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

  const tableSelector = "table"; // Replace with the CSS selector for the table

  for (const event of events) {
    for (const gender of genders) {
      console.log(
        `Scraping event: ${event} for gender: ${gender} and season: ${season_id}`
      );
      let url = `https://www.swimcloud.com/team/${team_id}/times/?dont_group=false&event=${event}&event_course=Y&gender=${gender}&page=1&region&season_id=${season_id}&tag_id&team_id=${team_id}&year=2024`;

      // if (event === 11650) {
      console.log(url);
      // }

      await scrapeTable(url, tableSelector)
        .then((data) => {
          data = arrayToObjects(data);

          for (const row of data) {
            row.seconds = minutesToSeconds(row.time);
            row.event_Id = event;
            row.event = getEventName(event);
            row.gender = gender === "M" ? "Male" : "Female";
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
  return times;
}

export async function scrapeEvent(event_id, gender, team_id) {
  let times = [];
  const season_id = getCurrentSeasonId();
  const tableSelector = "table";
  // const eventId = getEventId(event);
  const event = getEventName(event_id);
  let url = `https://www.swimcloud.com/team/${team_id}/times/?dont_group=false&event=${event_id}&event_course=Y&gender=${gender}&page=1&region&season_id=${season_id}&tag_id&team_id=${team_id}&year=2024`;

  await scrapeTable(url, tableSelector)
    .then((data) => {
      data = arrayToObjects(data);
      for (const row of data) {
        row.seconds = minutesToSeconds(row.time);
        row.event_Id = event_id;
        row.event = getEventName(event);
        row.gender = gender === "M" ? "Male" : "Female";
      }

      times = times.concat(data);
      console.log(data);
    })
    .catch((error) => {
      console.error("URL: ", url);
      console.error("Error scraping table:", error);
    });

  return times;
}

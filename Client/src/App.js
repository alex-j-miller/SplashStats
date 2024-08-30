import React, { useState, useEffect } from "react";
import "./index.css";
import Dropdown from "./components/Dropdown.jsx";
import ReactVirtualizedTable from "./components/ReactVirtualizedTable.jsx";
import DownloadButton from "./components/DownloadButton.jsx";

const parseCSV = (str) => {
  const lines = str.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // regex to handle commas inside quotes
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i].replace(/(^"|"$)/g, ""); // remove leading and trailing quotes
      return obj;
    }, {});
  });
};

const App = () => {
  const [swimmers, setSwimmers] = useState([]);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState("50 Free");
  const [gender, setGender] = useState("Male");

  const events = [
    { name: "50 Free" },
    { name: "100 Free" },
    { name: "200 Free" },
    { name: "500 Free" },
    { name: "1000 Free" },
    { name: "1650 Free" },
    { name: "50 Back" },
    { name: "100 Back" },
    { name: "200 Back" },
    { name: "50 Breast" },
    { name: "100 Breast" },
    { name: "200 Breast" },
    { name: "50 Fly" },
    { name: "100 Fly" },
    { name: "200 Fly" },
    { name: "100 IM" },
    { name: "200 IM" },
    { name: "400 IM" },
  ];

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/times.csv`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        const parsedData = parseCSV(data);
        const filteredData = parsedData.filter(
          (swimmer) => swimmer.Event === event && swimmer.Gender === gender
        );

        filteredData.forEach((swimmer) => {
          console.log("FILTERED: " + swimmer.Event);
        });

        const sortedData = filteredData.sort(function (a, b) {
          return a["Time in Seconds"] - b["Time in Seconds"];
        });

        sortedData.forEach((swimmer) => {
          console.log("SORTED: " + swimmer["Time in Seconds"]);
        });

        setSwimmers(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching the CSV data:", error);
        setError(error.message);
      });
  }, [event, gender]);

  const onGenderSelect = (newGender) => {
    setGender(newGender);
  };

  const onEventSelect = (newEvent) => {
    setEvent(newEvent);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ background: "#EEF7FF", height: "fill" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          background: "#4D869C",
          alignItems: "center",
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL}/splash.svg`}
          alt="logo"
          style={{ width: "80px", margin: 20, alignItems: "center" }}
        />
        <h1 style={{ color: "#EEF7FF", fontSize: 50 }}>
          <strong>SplashStats</strong>
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            marginTop: 50,
            marginLeft: 200,
            marginRight: 25,
            width: "60%",
          }}
        >
          <ReactVirtualizedTable rows={swimmers} />
        </div>
        <div
          style={{
            marginTop: 100,
            marginLeft: 50,
            marginRight: 25,
            height: "100%",
            justifyContent: "center",
            padding: 10,
            background: "#CDE8E5",
            borderRadius: 10,
          }}
        >
          <div
            style={{
              alignItems: "center",
              margin: 10,
              padding: 10,
            }}
          >
            <label style={{ margin: 5 }}>Sort:</label>
            <div style={{ marginTop: 5 }}>
              <Dropdown
                options={events}
                label={"Event"}
                onSelect={onEventSelect}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <Dropdown
                options={[{ name: "Male" }, { name: "Female" }]}
                label={"Gender"}
                onSelect={onGenderSelect}
              />
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <label style={{ margin: 5 }}>Download:</label>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                marginBottom: 10,
              }}
            >
              <DownloadButton variant="outlined" text="Page" />
              <DownloadButton variant="contained" text="All" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

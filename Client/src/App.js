import React, { useState, useEffect } from "react";
import "./index.css";
import Dropdown from "./components/Dropdown.jsx";
import ReactVirtualizedTable from "./components/ReactVirtualizedTable.jsx";
import Button from "@mui/material/Button";

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

  const events = [
    { name: "50 Y Free" },
    { name: "100 Y Free" },
    { name: "200 Y Free" },
    { name: "500 Y Free" },
    { name: "1000 Y Free" },
    { name: "1650 Y Free" },
    { name: "50 Y Back" },
    { name: "100 Y Back" },
    { name: "200 Y Back" },
    { name: "50 Y Breast" },
    { name: "100 Y Breast" },
    { name: "200 Y Breast" },
    { name: "50 Y Fly" },
    { name: "100 Y Fly" },
    { name: "200 Y Fly" },
    { name: "100 Y IM" },
    { name: "200 Y IM" },
    { name: "400 Y IM" },
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
        setSwimmers(
          parsedData
            .filter(
              (swimmer) =>
                swimmer.swimmer_name === "Jaden L Brookens" ||
                swimmer.swimmer_name === "Anthony C Crudele"
            )
            .sort(() => Math.random() - 0.5)
        );
      })
      .catch((error) => {
        console.error("Error fetching the CSV data:", error);
        setError(error.message);
      });
  }, []);

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
          <strong>Splash Stats</strong>
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
            // pagging: 20,
            background: "#CDE8E5",
            borderRadius: 10,
          }}
        >
          <div style={{ marginTop: 10 }}>
            <label style={{ margin: 5 }}>Download:</label>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <Button variant="outlined" style={{ margin: 5 }}>
                Page
              </Button>
              <Button variant="contained" style={{ margin: 5 }}>
                All
              </Button>
            </div>
          </div>
          <div
            style={{
              alignItems: "center",
              margin: 10,
            }}
          >
            <div>
              <Dropdown options={events} label={"Event"} />
            </div>
            <div style={{ marginTop: 10 }}>
              <Dropdown
                options={[{ name: "Male" }, { name: "Female" }]}
                label={"Gender"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

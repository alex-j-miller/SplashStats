const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Hello, Express.js Server!</h1>");
});

// Include route files
const usersRoute = require("./routes/events");

// Use routes
app.use("/events", usersRoute);

const port = process.env.PORT || 3000; // You can use environment variables for port configuration
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

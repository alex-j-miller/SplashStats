const { Pool } = require("pg");

// The secret connection string you copied earlier
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
});

module.exports = pool;

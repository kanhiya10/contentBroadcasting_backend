const express = require("express");
const app = express();
const pool = require("./config/db");

async function testDB() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("DB Connected:", res.rows[0]);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

testDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

async function startServer() {
  try {
    // DB connection test
    const res = await pool.query("SELECT NOW()");
    console.log("DB Connected:", res.rows[0]);

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err.message);
  }
}

startServer();
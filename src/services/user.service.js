const pool = require("../config/db");
const bcrypt = require("bcrypt");

exports.register = async ({ name, email, password, role }) => {
  if (!name || !email || !password || !role) {
    throw new Error("All fields are required");
  }

  const existing = await pool.query(
    "SELECT 1 FROM users WHERE email = $1",
    [email]
  );

  if (existing.rowCount > 0) {
    throw new Error("User already exists");
  }

  // 🔐 only one principal allowed
  if (role === "principal") {
    const principalCheck = await pool.query(
      `SELECT 1 FROM users WHERE role = 'principal'`
    );

    if (principalCheck.rowCount > 0) {
      throw new Error("Principal already exists");
    }
  }

  const password_hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [name, email, password_hash, role]
  );

  return result.rows[0];
};

exports.login = async ({ email, password }) => {
  if(!email || !password) {
    throw new Error("Email and password are required");
  }

  // 1. Find user
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  // 2. Compare password
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};
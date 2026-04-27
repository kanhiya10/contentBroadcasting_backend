const pool = require("../config/db");

exports.createContent = async (data, userId) => {
  const {
    title,
    description,
    subject,
    file_url,
    file_type,
    file_size,
  } = data;

  // required fields check
  if (!title || !subject || !file_url) {
    throw new Error("Missing required fields");
  }

  const result = await pool.query(
    `INSERT INTO content 
    (title, description, subject, file_url, file_type, file_size, uploaded_by, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,'pending')
    RETURNING *`,
    [
      title,
      description,
      subject,
      file_url,
      file_type,
      file_size,
      userId,
    ]
  );

  return result.rows[0];
};


exports.getByUser = async (userId) => {
  const result = await pool.query(
    `SELECT id, title, subject, status, rejection_reason, created_at
     FROM content
     WHERE uploaded_by = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
};
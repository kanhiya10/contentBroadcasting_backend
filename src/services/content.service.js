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

exports.getContent = async (status) => {
  let query = `SELECT * FROM content`;
  let values = [];

  if (status) {
    query += ` WHERE status = $1`;
    values.push(status);
  }

  query += ` ORDER BY created_at DESC`;

  const result = await pool.query(query, values);
  return result.rows;
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

exports.updateStatus = async (contentId, status, rejectionReason, principalId) => {

  // ✅ 1. Validate status
  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid status");
  }

  // ✅ 2. Fetch content
  const contentRes = await pool.query(
    "SELECT * FROM content WHERE id = $1",
    [contentId]
  );

  if (contentRes.rowCount === 0) {
    throw new Error("Content not found");
  }

  const content = contentRes.rows[0];

  // ✅ 3. Prevent re-approval / re-rejection (optional but recommended)
  if (content.status !== "pending") {
    throw new Error("Content already reviewed");
  }

  // ✅ 4. If rejected → reason is mandatory
  if (status === "rejected" && !rejectionReason) {
    throw new Error("Rejection reason is required");
  }

  // ✅ 5. If approved → remove rejection reason
  const finalRejectionReason = status === "approved" ? null : rejectionReason;

  // ✅ 6. Update DB
  const result = await pool.query(
    `UPDATE content
     SET status = $1,
         rejection_reason = $2,
         approved_by = $3,
         approved_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [status, finalRejectionReason, principalId, contentId]
  );

  return result.rows[0];
};

exports.getLiveContentBySubject = async (subject) => {
  const query = `
    SELECT 
      s.id AS schedule_id,
      c.id AS content_id,
      c.title,
      c.file_url,
      c.file_type,
      c.uploaded_by AS teacher_id,
      s.start_time,
      s.end_time
    FROM content_schedule s
    JOIN content_slots sl ON s.slot_id = sl.id
    JOIN content c ON s.content_id = c.id
    WHERE LOWER(sl.subject) = LOWER($1)
      AND c.status = 'approved'
      AND NOW() >= s.start_time 
      AND NOW() <= s.end_time
    LIMIT 1;
  `;

  const result = await pool.query(query, [subject]);
  return result.rows[0]; // Returns the row or undefined
};
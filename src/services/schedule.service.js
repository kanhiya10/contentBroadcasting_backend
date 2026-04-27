const pool = require("../config/db");

exports.createSchedule = async (data, teacherId) => {
  const {
    content_id,
    rotation_order,
    duration,
    start_time,
    end_time,
  } = data;

  if (!content_id || !duration || !start_time || !end_time) {
    throw new Error("Missing required fields");
  }

  if (new Date(start_time) >= new Date(end_time)) {
    throw new Error("start_time must be before end_time");
  }

  // 1. Get content
  const content = await pool.query(
    `SELECT * FROM content WHERE id = $1`,
    [content_id]
  );

  if (content.rowCount === 0) {
    throw new Error("Content not found");
  }

  const contentRow = content.rows[0];

  // 2. Check approved
  if (contentRow.status !== "approved") {
    throw new Error("Only approved content can be scheduled");
  }

  // 3. Ownership check
  if (contentRow.uploaded_by !== teacherId) {
    throw new Error("You can only schedule your own content");
  }

  const subject = contentRow.subject;

  // 4. Get slot_id from subject
  const slot = await pool.query(
    `SELECT id FROM content_slots WHERE LOWER(subject) = $1`,
    [subject.toLowerCase()]
  );

  if (slot.rowCount === 0) {
    throw new Error("Subject not found in slots");
  }

  const slot_id = slot.rows[0].id;


  // 6. Insert schedule
  const result = await pool.query(
    `INSERT INTO content_schedule
     (content_id, slot_id, rotation_order, duration, start_time, end_time)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [
      content_id,
      slot_id,
      rotation_order || null,
      duration,
      start_time,
      end_time,
    ]
  );

  return result.rows[0];
};
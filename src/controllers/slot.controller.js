const pool = require("../config/db");

// Create subject (Principal only)
exports.createSlot = async (req, res) => {
  try {
    let { subject } = req.body;

    if (!subject) {
      return res.status(400).json({ message: "Subject is required" });
    }

    subject = subject.trim().toLowerCase();

    const result = await pool.query(
      `INSERT INTO content_slots (subject)
       VALUES ($1)
       RETURNING *`,
      [subject]
    );

    res.status(201).json({
      message: "Subject created successfully",
      slot: result.rows[0],
    });
  } catch (err) {
    // handle duplicate error from DB constraint
    if (err.code === "23505") {
      return res.status(409).json({
        message: "Subject already exists",
      });
    }

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all subjects
exports.getAllSlots = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM content_slots ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.assignTeacherToSubject = async (req, res) => {
  try {
    const { teacher_id, slot_id } = req.body;

    // 1. validate input
    if (!teacher_id || !slot_id) {
      return res.status(400).json({
        message: "teacher_id and slot_id are required",
      });
    }

    // 2. check if teacher exists and role is teacher
    const teacher = await pool.query(
      `SELECT id, role FROM users WHERE id = $1`,
      [teacher_id]
    );

    if (teacher.rowCount === 0) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    if (teacher.rows[0].role !== "teacher") {
      return res.status(400).json({
        message: "Selected user is not a teacher",
      });
    }

    // 3. check if subject exists
    const slot = await pool.query(
      `SELECT id FROM content_slots WHERE id = $1`,
      [slot_id]
    );

    if (slot.rowCount === 0) {
      return res.status(404).json({
        message: "Subject/Slot not found",
      });
    }

    // 4. prevent duplicate mapping
    const existing = await pool.query(
      `SELECT 1 FROM teacher_subjects
       WHERE teacher_id = $1 AND slot_id = $2`,
      [teacher_id, slot_id]
    );

    if (existing.rowCount > 0) {
      return res.status(409).json({
        message: "Teacher already assigned to this subject",
      });
    }

    // 5. insert mapping
    const result = await pool.query(
      `INSERT INTO teacher_subjects (teacher_id, slot_id)
       VALUES ($1, $2)
       RETURNING *`,
      [teacher_id, slot_id]
    );

    return res.status(201).json({
      message: "Teacher assigned to subject successfully",
      mapping: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
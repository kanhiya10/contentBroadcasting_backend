const contentService = require("../services/content.service");

exports.uploadContent = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("File is required");
    }

    const data = {
      ...req.body,
      file_url: req.file.path,
      file_type: req.file.mimetype,
      file_size: req.file.size,
    };

    const content = await contentService.createContent(
      data,
      req.user.id
    );

    res.status(201).json({
      message: "Content uploaded successfully",
      content,
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getContent = async (req, res) => {
  try {
    const { status } = req.query;

    const data = await contentService.getContent(status);

    res.json({
      message: "Content fetched",
      data,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyContent = async (req, res) => {
  try {
    const contents = await contentService.getByUser(req.user.id);

    res.json(contents);

  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

exports.updateContentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejection_reason } = req.body;

    const result = await contentService.updateStatus(
      id,
      status,
      rejection_reason,
      req.user.id
    );

    res.json({
      message: "Content status updated successfully",
      data: result,
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLiveContentBySubject = async (req, res) => {
  try {
    const { subject } = req.params;

    const liveContent = await contentService.getLiveContentBySubject(subject);

    if (!liveContent) {
      return res.status(200).json({ 
        message: "No content available" 
      });
    }

    res.json({
      message: `Currently broadcasting in ${subject}`,
      data: liveContent,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
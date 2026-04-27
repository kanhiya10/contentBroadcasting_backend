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
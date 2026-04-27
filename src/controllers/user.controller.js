const userService = require("../services/user.service");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const user = await userService.register(req.body);
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await userService.login(req.body);

    // 🔐 Generate token here
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user,
    });

  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};
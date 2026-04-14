const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role: "user"
    });

    res.json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error during User Signup", error: error.message });
  }
};


exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) return res.status(400).json({ msg: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hash,
      role: "admin"
    });

    res.json({ message: "Admin registered successfully", admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error during Admin Signup", error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User account not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      userId: user._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error during Login", error: error.message });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User account not found" });
    if (user.role !== "user") return res.status(403).json({ msg: "User login only" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error during Login", error: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User account not found" });
    if (user.role !== "admin") return res.status(403).json({ msg: "Admin login only" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role, userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error during Login", error: error.message });
  }
};

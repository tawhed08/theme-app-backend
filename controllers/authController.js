const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const COOKIE_NAME = "theme_studio_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const publicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
});

const setSessionCookie = (res, userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    const error = new Error("Authentication is not configured. Set JWT_SECRET to a random value of at least 32 characters.");
    error.status = 503;
    throw error;
  }

  const token = jwt.sign({}, secret, {
    subject: userId.toString(),
    expiresIn: "7d",
    issuer: "theme-studio",
    audience: "theme-studio-web",
  });

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/api",
  });
};

const handleAuthError = (res, error, fallback) => {
  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  console.error(fallback, error);
  return res.status(500).json({ message: fallback });
};

const register = async (req, res) => {
  const { name, email, password } = req.body ?? {};
  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.trim().length > 80 ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 128
  ) {
    return res.status(400).json({
      message: "Enter your name, a valid email, and a password between 8 and 128 characters.",
    });
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    return res.status(503).json({
      message: "Authentication is not configured. Set JWT_SECRET to a random value of at least 32 characters.",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
    });
    setSessionCookie(res, user._id);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    return handleAuthError(res, error, "Could not create your account.");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body ?? {};
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    password.length > 128
  ) {
    return res.status(400).json({ message: "Enter your email and password." });
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    return res.status(503).json({
      message: "Authentication is not configured. Set JWT_SECRET to a random value of at least 32 characters.",
    });
  }

  try {
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    setSessionCookie(res, user._id);
    return res.status(200).json({ user: publicUser(user) });
  } catch (error) {
    return handleAuthError(res, error, "Could not sign in.");
  }
};

const me = async (req, res) => {
  if (!req.userId) {
    return res.status(200).json({ user: null });
  }

  try {
    const user = await User.findById(req.userId).select("_id name email");
    if (!user) {
      return res.status(401).json({ message: "Your session is no longer valid." });
    }
    return res.status(200).json({ user: publicUser(user) });
  } catch (error) {
    return handleAuthError(res, error, "Could not load your account.");
  }
};

const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/api",
  });
  return res.status(200).json({ message: "Signed out successfully." });
};

module.exports = { register, login, me, logout };

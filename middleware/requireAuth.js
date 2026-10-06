const jwt = require("jsonwebtoken");
const User = require("../models/User");

const readCookie = (header, name) => {
  const item = header
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return item ? item.slice(name.length + 1) : null;
};

const requireAuth = async (req, res, next) => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    return res.status(503).json({
      message: "Authentication is not configured. Set JWT_SECRET to a random value of at least 32 characters.",
    });
  }

  const bearer = req.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  const token = bearer || readCookie(req.headers.cookie, "theme_studio_session");

  if (!token) {
    return res.status(401).json({ message: "Please sign in to continue." });
  }

  let payload;
  try {
    payload = jwt.verify(token, secret, {
      issuer: "theme-studio",
      audience: "theme-studio-web",
    });
  } catch {
    return res.status(401).json({ message: "Your session has expired. Please sign in again." });
  }

  if (typeof payload !== "object" || typeof payload.sub !== "string") {
    return res.status(401).json({ message: "Invalid session." });
  }

  try {
    const user = await User.findById(payload.sub).select("_id");
    if (!user) {
      return res.status(401).json({ message: "Your session is no longer valid." });
    }

    req.userId = user._id;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = requireAuth;

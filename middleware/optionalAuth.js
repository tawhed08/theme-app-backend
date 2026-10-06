const jwt = require("jsonwebtoken");
const User = require("../models/User");

const readCookie = (header, name) => {
  const item = header
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return item ? item.slice(name.length + 1) : null;
};

const optionalAuth = async (req, res, next) => {
  const token =
    req.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1] ||
    readCookie(req.headers.cookie, "theme_studio_session");

  if (!token || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "theme-studio",
      audience: "theme-studio-web",
    });
    if (typeof payload !== "object" || typeof payload.sub !== "string") {
      return next();
    }

    const user = await User.findById(payload.sub).select("_id");
    if (user) req.userId = user._id;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next();
    }
    return next(error);
  }
};

module.exports = optionalAuth;

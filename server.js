const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const themeRoutes = require("./routes/themeRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
const configuredOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// ==============================
// DATABASE
// ==============================

connectDB();

// ==============================
// CORS
// ==============================

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin
      // such as curl/Postman
      if (!origin) {
        return callback(null, true);
      }

      // Allow every localhost / 127.0.0.1 port
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(
        origin,
      );

      if (isLocalhost || configuredOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        Object.assign(
          new Error("CORS blocked this origin."),
          { status: 403 },
        ),
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
    credentials: true,
  }),
);

// ==============================
// BODY PARSER
// ==============================

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ==============================
// HEALTH CHECK
// ==============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Theme Studio API is running",
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Theme Studio API is running",
  });
});

// ==============================
// API ROUTES
// ==============================

app.use(
  "/api/auth",
  authRoutes,
);

app.use(
  "/api/themes",
  themeRoutes,
);

// ==============================
// 404
// ==============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ==============================
// ERROR HANDLER
// ==============================

app.use(
  (err, req, res, next) => {
    console.error(
      "SERVER ERROR:",
      err,
    );

    if (res.headersSent) {
      return next(err);
    }

    const status =
      err.status ||
      err.statusCode ||
      (err.type === "entity.parse.failed" ? 400 : 500);

    return res.status(status).json({
      success: false,
      message:
        err.message ||
        "Internal server error",
    });
  },
);

// ==============================
// START SERVER
// ==============================

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`,
  );
});
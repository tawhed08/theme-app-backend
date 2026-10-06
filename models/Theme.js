const mongoose = require("mongoose");

const typographySchema = new mongoose.Schema(
  {
    fontFamily: {
      type: String,
      default: "Inter",
    },
    headingSize: {
      type: Number,
      default: 48,
    },
    bodySize: {
      type: Number,
      default: 16,
    },
    headingWeight: {
      type: Number,
      default: 700,
    },
    bodyWeight: {
      type: Number,
      default: 400,
    },
    lineHeight: {
      type: Number,
      default: 1.6,
    },
    letterSpacing: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const radiusSchema = new mongoose.Schema(
  {
    none: {
      type: Number,
      default: 0,
    },
    sm: {
      type: Number,
      default: 4,
    },
    md: {
      type: Number,
      default: 8,
    },
    lg: {
      type: Number,
      default: 12,
    },
    xl: {
      type: Number,
      default: 20,
    },
    custom: {
      type: Number,
      default: 16,
    },
  },
  { _id: false },
);

const shadowsSchema = new mongoose.Schema(
  {
    none: {
      type: String,
      default: "none",
    },
    sm: {
      type: String,
      default: "0 1px 3px rgba(0, 0, 0, 0.08)",
    },
    md: {
      type: String,
      default: "0 4px 10px rgba(0, 0, 0, 0.10)",
    },
    lg: {
      type: String,
      default: "0 10px 25px rgba(0, 0, 0, 0.14)",
    },
    xl: {
      type: String,
      default: "0 20px 45px rgba(0, 0, 0, 0.18)",
    },
    custom: {
      type: String,
      default: "0 18px 50px rgba(0, 0, 0, 0.25)",
    },
  },
  { _id: false },
);

const spacingSchema = new mongoose.Schema(
  {
    xs: {
      type: Number,
      default: 4,
    },
    sm: {
      type: Number,
      default: 8,
    },
    md: {
      type: Number,
      default: 12,
    },
    lg: {
      type: Number,
      default: 16,
    },
    xl: {
      type: Number,
      default: 24,
    },
    xxl: {
      type: Number,
      default: 32,
    },
    huge: {
      type: Number,
      default: 48,
    },
    custom: {
      type: Number,
      default: 20,
    },
  },
  { _id: false },
);

const themeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: undefined,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    background: {
      type: String,
      required: true,
      trim: true,
    },

    surface: {
      type: String,
      required: true,
      trim: true,
    },

    primary: {
      type: String,
      required: true,
      trim: true,
    },

    secondary: {
      type: String,
      required: true,
      trim: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    accent: {
      type: String,
      required: true,
      trim: true,
    },

    success: {
      type: String,
      default: "#22C55E",
      trim: true,
    },

    warning: {
      type: String,
      default: "#F59E0B",
      trim: true,
    },

    error: {
      type: String,
      default: "#EF4444",
      trim: true,
    },

    info: {
      type: String,
      default: "#3B82F6",
      trim: true,
    },

    gradient: {
      type: String,
      default: "",
      trim: true,
    },

    typography: {
      type: typographySchema,
      default: () => ({}),
    },

    radius: {
      type: radiusSchema,
      default: () => ({}),
    },

    shadows: {
      type: shadowsSchema,
      default: () => ({}),
    },

    spacing: {
      type: spacingSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

const Theme =
  mongoose.models.Theme ||
  mongoose.model("Theme", themeSchema);

module.exports = Theme;
const Theme = require("../models/Theme");

const getErrorStatus = (error) => {
  if (
    error.name === "CastError" ||
    error.name === "ValidationError"
  ) {
    return 400;
  }

  return 500;
};

const getThemes = async (req, res) => {
  try {
    const themes = await Theme.find({
      user: req.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json(themes);
  } catch (error) {
    console.error("GET THEMES ERROR:", error);

    return res.status(getErrorStatus(error)).json({
      message: "Failed to fetch themes",
      error: error.message,
    });
  }
};

const getThemeById = async (req, res) => {
  try {
    const theme = await Theme.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!theme) {
      return res.status(404).json({
        message: "Theme not found",
      });
    }

    return res.status(200).json(theme);
  } catch (error) {
    console.error("GET THEME ERROR:", error);

    return res.status(getErrorStatus(error)).json({
      message: "Failed to fetch theme",
      error: error.message,
    });
  }
};

const createTheme = async (req, res) => {
  try {
    if (
      typeof req.body !== "object" ||
      req.body === null ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        message: "A theme JSON object is required",
      });
    }

    const {
      name,
      description,
      background,
      surface,
      primary,
      secondary,
      text,
      accent,
      success,
      warning,
      error,
      info,
      gradient,
      typography,
      radius,
      shadows,
      spacing,
    } = req.body;

    if (
      !name ||
      !background ||
      !surface ||
      !primary ||
      !secondary ||
      !text ||
      !accent
    ) {
      return res.status(400).json({
        message:
          "name, background, surface, primary, secondary, text and accent are required",
      });
    }

    const theme = await Theme.create({
      user: req.userId,
      name,
      description: description || "",

      background,
      surface,
      primary,
      secondary,
      text,
      accent,

      success: success || "#22C55E",
      warning: warning || "#F59E0B",
      error: error || "#EF4444",
      info: info || "#3B82F6",

      gradient: gradient || "",

      typography: typography || {},
      radius: radius || {},
      shadows: shadows || {},
      spacing: spacing || {},
    });

    return res.status(201).json(theme);
  } catch (error) {
    console.error("CREATE THEME ERROR:", error);

    return res.status(getErrorStatus(error)).json({
      message: "Failed to save theme",
      error: error.message,
    });
  }
};

const updateTheme = async (req, res) => {
  try {
    if (
      typeof req.body !== "object" ||
      req.body === null ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        message: "A theme JSON object is required",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "background",
      "surface",
      "primary",
      "secondary",
      "text",
      "accent",
      "success",
      "warning",
      "error",
      "info",
      "gradient",
      "typography",
      "radius",
      "shadows",
      "spacing",
    ];
    const updates = Object.fromEntries(
      allowedFields
        .filter((field) =>
          Object.prototype.hasOwnProperty.call(req.body, field),
        )
        .map((field) => [field, req.body[field]]),
    );

    const theme = await Theme.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!theme) {
      return res.status(404).json({
        message: "Theme not found",
      });
    }

    return res.status(200).json(theme);
  } catch (error) {
    console.error("UPDATE THEME ERROR:", error);

    return res.status(getErrorStatus(error)).json({
      message: "Failed to update theme",
      error: error.message,
    });
  }
};

const deleteTheme = async (req, res) => {
  try {
    const theme = await Theme.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!theme) {
      return res.status(404).json({
        message: "Theme not found",
      });
    }

    return res.status(200).json({
      message: "Theme deleted successfully",
    });
  } catch (error) {
    console.error("DELETE THEME ERROR:", error);

    return res.status(getErrorStatus(error)).json({
      message: "Failed to delete theme",
      error: error.message,
    });
  }
};

module.exports = {
  getThemes,
  getThemeById,
  createTheme,
  updateTheme,
  deleteTheme,
};
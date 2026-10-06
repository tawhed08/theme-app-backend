const express = require("express");
const requireAuth = require("../middleware/requireAuth");

const {
  getThemes,
  getThemeById,
  createTheme,
  updateTheme,
  deleteTheme,
} = require("../controllers/themeController");

const router = express.Router();

router.use(requireAuth);

router.get("/", getThemes);

router.get("/:id", getThemeById);

router.post("/", createTheme);

router.put("/:id", updateTheme);

router.delete("/:id", deleteTheme);

module.exports = router;
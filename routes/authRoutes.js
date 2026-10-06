const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const optionalAuth = require("../middleware/optionalAuth");
const { register, login, me, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", optionalAuth, me);
router.post("/logout", logout);

module.exports = router;

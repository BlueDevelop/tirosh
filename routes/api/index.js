const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/updates", require("./updates"));
router.use("/events", require("./events"));
router.use("/files", require("./files"));

module.exports = router;

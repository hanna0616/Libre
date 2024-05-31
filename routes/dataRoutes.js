const express = require("express");
const getGlucose = require("../controllers/dataControllers.js");

const router = express.Router();

router.route("/glucose").get(getGlucose);

module.exports = router;

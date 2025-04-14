const express = require("express");
const router = express.Router();
const { generateEntities } = require("../controllers/entityController");

router.post("/", generateEntities);

module.exports = router;

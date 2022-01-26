const express = require("express");
const router = express.Router();

const {signUp} = require("../controllers/user");

router.post('/', signUp);

module.exports = router;
const express = require("express");
const router = express.Router();

const {signUp} = require("../controllers/user");
const { validateUserPayLoad } = require("../middlewares/validateRequestBody");

router.post('/',[validateUserPayLoad], signUp);

module.exports = router;
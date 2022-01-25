const router = require('express').Router();
const users = require('./routes/users');
const login =  require("./routes/logins")
const signup =  require("./routes/signups")

// users routes 
router.use("/signup", signup);
router.use('/users', users);
router.use("/login", login);

module.exports = router;

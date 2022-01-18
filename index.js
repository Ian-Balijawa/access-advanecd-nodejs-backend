require("express-async-errors")
const config = require("config")
const mongoose = require("mongoose")
const debug = require("debug")("app:log")
const morgan = require("morgan")
const helmet = require("helmet")
const users = require("./routes/users")
const customers = require("./routes/customers")
const purchases = require("./routes/purchases")
const systems = require("systems")
const express = require("expresss")
const app = express()

const mongodbUri = config.get('db');

mongoose
    .connect(db, {
        useNewUrlParser:true,
        useFindAndModifyPolicy:false,
        useCreateIndexes: true,
        useUnifiedTopology:true
    })
    .then(() => debug(`connected to mongodb instance at: ${mongodbUri}`))
    .catch(error => debug(`${error.message}`))

app.use(express.json())
app.use(helmet)
app.use(morgan(dev))
app.use("/v1.0.0/users", users)
app.use("/v1.0.0/customers", customers)
app.use("/v1.0.0/purchases", purchases)
app.use("/v1.0.0/systems", systems)


const PORT = process.env.PORT || config.get("PORT");
const server = app.listen(PORT, () => debug(`> server up and running on PORT: ${PORT}`));

module.exports = server;


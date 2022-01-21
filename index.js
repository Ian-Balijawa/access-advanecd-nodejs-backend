require('express-async-errors');
const config = require('config');
const mongoose = require('mongoose');
const debug = require('debug')('app:log');
const morgan = require('morgan');
const helmet = require('helmet');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const users = require('./routes/user.route');
const customers = require('./routes/customer.route');
const purchases = require('./routes/purchase.route');
const systems = require('./routes/system.route');
const express = require('express');
const { object } = require('joi');
const app = express();

const mongodbUri = config.get('db');

// mongoose
//     .connect(mongodbUri, {
//         useNewUrlParser:true,
//         useFindAndModifyPolicy:false,
//         useCreateIndexes: true,
//         useUnifiedTopology:true
//     })
//     .then(() => debug(`connected to mongodb instance at: ${mongodbUri}`))
//     .catch(error => debug(`${error.message}`))

app.use(expressValidator());
app.use(
	expressValidator({
		customValidators: {
			isArray: function (value) {
				return Array.isArray(value);
			},
			isLocationObject: function (value) {
				if (value && value.constructor === object) {
					if (
						value.hasOwnProperty('latitude') &&
						value.hasOwnProperty('longitude')
					) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			},
		},
	})
);
app.use(express.json());
app.use(helmet);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use('/v1.0.0/users', users);
app.use('/v1.0.0/systems', systems);
// app.use("/v1.0.0/customers", customers)
// app.use("/v1.0.0/purchases", purchases)

const PORT = process.env.PORT || config.get('PORT');
const server = app.listen(PORT, () =>
	debug(`> server up and running on PORT: ${PORT}`)
);

module.exports = server;

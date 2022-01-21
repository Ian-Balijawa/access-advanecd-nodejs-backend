require('express-async-errors');
const config = require('config');
const mongoose = require('mongoose');
const debug = require('debug')('app:log');
const morgan = require('morgan');
const helmet = require('helmet');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const users = require('./routes/users.route');
const customers = require('./routes/customers.route');
const sales = require('./routes/sales.route');
const Products = require('./routes/Products.route');
const express = require('express');
const CORS = require('./middlewares/cors');

const mongodbUri = config.get('db');

mongoose
	.connect(mongodbUri, {
		useNewUrlParser: true,
		useFindAndModifyPolicy: false,
		useCreateIndexes: true,
		useUnifiedTopology: true,
	})
	.then(() => debug(`connected to mongodb instance at: ${mongodbUri}`))
	.catch((error) => debug(`${error.message}`));

const app = express();
app.use(CORS);
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
app.use(cookieParser());
app.use(CORS);
app.use(express.urlencoded({ extended: true }));
app.use('/v1.0.0/users', users);
app.use('/v1.0.0/Products', Products);
app.use('/v1.0.0/customers', customers);
app.use('/v1.0.0/sales', sales);

const PORT = process.env.PORT || config.get('PORT');
const server = app.listen(PORT, () =>
	debug(`> server up and running on PORT: ${PORT}`)
);

module.exports = server;

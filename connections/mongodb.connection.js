//const Log = require('log'), log = new Log();
// Bring Mongoose into the app
const mongoose = require('mongoose');
const config = require('../config/config');
const { logger } = require('../utils/logger');
// const config = require('../config/config'); //for db connection strings and settings
// Create the database connection
const mongoUri = config.db.master;
// const db = mongoose.createConnection(mongoUri);

// CONNECTION EVENTS

// When successfully connected
db.on('connected', () => {
	// console.log("Mongoose connection open to master DB")
	logger.info('Mongoose connection open to master DB');
});

// If the connection throws an error
db.on('error', (err) => {
	// console.log('Mongoose connection error for master DB: ' + err)
	logger.debug('Mongoose connection error for master DB: ' + err);
});

// When the connection is disconnected
db.on('disconnected', () => {
	// console.log("Mongoose connection disconnected for master DB")
	logger.debug('Mongoose connection disconnected for master DB');
});

//When connection is reconnected
db.on('reconnected', () => {
	// console.log("Mongoose connection reconnected for master DB")
	logger.info('Mongoose connection reconnected for master DB');
});
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
	db.close(function () {
		// console.log("Mongoose connection disconnected for master DB through app termination")
		logger.debug(
			'Mongoose connection disconnected for master DB through app termination'
		);
		process.exit(0);
	});
});

module.exports = db;

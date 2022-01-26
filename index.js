// require('express-async-errors');
const express = require('express');
const initializeApp = require('./start/initializeApp');
const config = require('config');
const { logger } = require('./utils/logger');

//TODO: something about requiring agenda npm package and initiating configurations

const app = express();

if (!config.get('jwtPrivateKey')) {
	logger.error('FATAL ERROR: jwtPrivateKey is not defined');

	process.exit(1);
}

const connectToDatabase = require('./start/initializeDB');

async function establishDatabaseConnection() {
	await connectToDatabase();
}

const server = initializeApp(app);

establishDatabaseConnection();

module.exports = server;

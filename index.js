// require('express-async-errors');
const express = require('express');
const initializeApp = require('./start/initializeApp');
const mongoose = require('mongoose');
const config = require('config');
const { logger } = require('./utils/logger');
/**
 * require agenda, but still dont what it does yet
 * const Agenda = require('agenda');
 *  const Agendash = require('agendash');
 *  const agenda = new Agenda({
 *    db: { address: config.db.master},
 *    maxConcurrency: 5,
 *    defaultConcurrency: 1
 *  });
 */

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

const mongoose = require('mongoose');
const { logger } = require('../utils/logger.js');
const config = require('../config/config.js');

const mongoUri = config.db.master;

async function connectToDatabase() {
	  try {
     await mongoose.connect(mongoUri, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});

      logger.debug(`==> Connected to a mongoDB at ${mongoUri}`);
  } catch (error) {
      logger.error(`${error}: Failed to connect to mongoDB... `)
  }
}
module.exports = connectToDatabase;

//var Log = require('log'), log = new Log();
// Bring Mongoose into the app
var mongoose = require( 'mongoose' );
var config=require('../config/config'); //for db connection strings and settings  
// Create the database connection
var db = mongoose.createConnection(config.db.master,config.db.options);


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
    logger.debug('Mongoose connection disconnected for master DB through app termination');
    process.exit(0);
  });
});

module.exports = db;

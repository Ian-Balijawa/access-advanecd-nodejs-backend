// NODE_ENV is a system environment variable (flag) that Node exposes into running scripts.

const {logger} = require('../utils/logger');

// It’s used by convention to determine dev-vs-prod behavior, by both server tools, build scripts, and client-side libraries.
if (process.env.NODE_ENV === 'production') { 

logger.console("========================> Production Environment <========================")
  module.exports = require('./prod');

} else {

  logger.console("=======================> Development Environment <========================")
  module.exports = require('./dev');

}

// NODE_ENV is a system environment variable (flag) that Node exposes into running scripts.
// It’s used by convention to determine dev-vs-prod behavior, by both server tools, build scripts, and client-side libraries.
if (process.env.NODE_ENV === 'production') { 

  console.log("------> Production Environment <-----")
  module.exports = require('./prod');

} else {

  console.log("------> Development Environment <-----")
  module.exports = require('./dev');

}

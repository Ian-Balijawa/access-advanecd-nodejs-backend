const express = require("express")
const createError = require('http-errors'); 
const cookieParser = require("cookie-parser");
// const indexRouter = require('./routes/index');

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




const app = express()

const {stream,logger} = require("./utils/logger");


// Morgan: is another HTTP request logger middleware for Node.js.
// It simplifies the process of logging requests to your application. 
// You might think of Morgan as a helper that collects logs from your server, such as your request logs.
// It saves developers time because they don’t have to manually create common logs. 
// It standardizes and automatically creates request logs.
// Morgan can operate standalone, but commonly it’s used in combination with Winston.
// Winston is able to transport logs to an external location, or query them when analyzing a problem.
app.use(require("morgan")(function(tokens, req,res){
    let ip = req.header('x-forwaded-for') || req.connection.remoteAddress;
    let accessToken = `accessToken:-${(req.headers['authorization']+"")}`
    return [
        req.user && req.user._id,
        ip,accessToken,
        tokens['remote-user'](req,res), tokens.date(req, res, 'clf'),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['referrer'](req, res),
        tokens['user-agent'](req, res),
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}, {"stream": stream}) )
app.use(require("helmet")())

app.use(express.json({limit: '5mb'}))
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

const publicDir = require("path").join(__dirname, "public")
app.use(express.static(publicDir));

app.options("*", function (req, res) { 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Authorization, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS ,PATCH");
    res.status(200).end();
  });
  app.use(function (req, res, next) { 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("X-Frame-Options","DENY");
    next();
  });

  // Use Routes
// app.use('/v1.0.0', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => logger.info(`> started server and listening on port ${PORT}...`));

  module.exports = app;

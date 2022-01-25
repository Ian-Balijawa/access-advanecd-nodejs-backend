const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const { stream } = require('../utils/logger');
const { CORSSelfEnded, CORS } = require('../middlewares/cors');
const appRouter = require('../routes/index');
const { logger } = require('../utils/logger');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { APIException } = require('../errors/api.error');
const config = require('config');

module.exports = function (app) {
  // Morgan: is another HTTP request logger middleware for Node.js.
  // It simplifies the process of logging requests to your application.
  // You might think of Morgan as a helper that collects logs from your server, such as your request logs.
  // It saves developers time because they don’t have to manually create common logs.
  // It standardizes and automatically creates request logs.
  // Morgan can operate standalone, but commonly it’s used in combination with Winston.
  // Winston is able to transport logs to an external location, or query them when analyzing a problem.
  app.use(
    morgan(
      function (tokens, req, res) {
        let ip = req.header('x-forwaded-for') || req.connection.remoteAddress;
        let accessToken = `accessToken:-${req.headers['authorization'] + ''}`;
        return [
          req.user && req.user._id,
          ip,
          accessToken,
          tokens['remote-user'](req, res),
          tokens.date(req, res, 'clf'),
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens.res(req, res, 'content-length'),
          '-',
          tokens['referrer'](req, res),
          tokens['user-agent'](req, res),
          tokens['response-time'](req, res),
          'ms',
        ].join(' ');
      },
      { stream: stream }
    )
  );

  app.use(helmet());
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  const publicDir = require('path').join(__dirname, 'public');
  app.use(express.static(publicDir));

  app.options('*', CORSSelfEnded);
  app.use(CORS);

  // Use Routes
  app.use('/v1.0.0', appRouter);

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
    res.status(err.status || new APIException().status);
    res.render('error');
  });

  const PORT = process.env.PORT || config.get('PORT');

  return app.listen(PORT, () =>
    logger.info(`> started server and listening on port ${PORT}...`)
  );
};

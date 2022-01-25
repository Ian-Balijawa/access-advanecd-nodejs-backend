module.exports.CORS = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization',
    'Orign',
    'X-Requested-With',
    'Content-Type',
    'Accept'
  );
  res.header('Access-Control-Allow-Methods', 'PUT,DELETE,PUT,POST,GET,OPTIONS');
  if (req.methods == 'OPTIONS') {
    res.status(200).send();
  } else {
    next();
  }
};

module.exports.CORSSelfEnded = function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type,Authorization, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, DELETE, OPTIONS ,PATCH'
  );
  res.status(200).end();
};
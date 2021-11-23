var express = require('express');
var router = express.Router();
var pool = require('../db_handler')();
var { inspect_jwt } = require('../login_handler');

/* GET users listing. */
router.get('/', function (req, res, next) {
  try {
    inspect_jwt(req.header('jwt-token'))
  } catch (err) {
    res.status(403).send(err);
    return;
  }
  pool.getConnection(function (err, connection) {
    if (err) throw err;
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
      if (error) throw error;
      console.log(results[0]);
      connection.release();
      res.send('' + results[0].solution);
    });
  });
});

module.exports = router;

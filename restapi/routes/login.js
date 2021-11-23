var express = require('express');
var router = express.Router();
var pool = require('../db_handler');
const { createHash } = require("crypto");

router.post('/', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        var credentials = JSON.parse(req.header('data'));
        var user = connection.query('Select * where AccountId =' + credentials.id);
        if (user.passwd == hash(req.passwd, user.salt)) {
            res.send('jwt provided login success');
            connection.release();
            return;
        }
    });
});

module.exports = router;


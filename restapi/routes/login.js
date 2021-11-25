var express = require('express');
var router = express.Router();
var pool = require('../db_handler')();
var { sign_jwt } = require('../login_handler');
const { createHash } = require("crypto");

router.post('/', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        console.log(req.headers)
        console.log(req.body)
        if (!req.body.id || !req.body.passwd) {
            res.status(401).send('id or passwd not provided.')
        }
        connection.query('Select * from Kortti where Korttinumero =' + req.body.id, function (err, user, fields) {
            if (user.length === 0) {
                res.status(401).send('login väärin')
                return;
            }
            else if (user[0].PIN == createHash('sha256').update(req.body.passwd + user[0].salt).digest('hex')) {
                tokeni = sign_jwt(user[0].Korttinumero);
                res.send({ 'token': tokeni });
                connection.release();
                return;
            }
            else if (err) {
                res.status(500).send(err);
                connection.release();
                return;
            }
            else {
                res.status(401).send('login väärin');
                connection.release();
                return;
            }
        });
    });
});

module.exports = router;


var express = require('express');
var router = express.Router();
var pool = require('../db_handler')();
var { sign_jwt } = require('../login_handler');
const { createHash } = require("crypto");

router.post('/', function (req, res, next) {
    pool.getConnection(async function (err, connection) {
        console.log(req.headers)
        console.log(req.body)
        if (!req.body.id || !req.body.passwd) {
            res.status(401).send('id or passwd not provided.')
        }
        connection.promise().query('Select * from Kortti where Korttinumero =' + req.body.id).then(user => {
            if (user[0].length === 0) {
                res.status(401).send('login väärin')
                return;
            }
            else if (user[0][0].PIN == createHash('sha256').update(req.body.passwd + user[0][0].salt).digest('hex')) {
                tokeni = sign_jwt(user[0][0].Korttinumero);
                res.send({ 'token': tokeni });
                return;
            }
            else if (err) {
                res.status(500).send(err);
                return;
            }
            else {
                res.status(401).send('login väärin');
                return;
            }
        });
    });
});


module.exports = router;


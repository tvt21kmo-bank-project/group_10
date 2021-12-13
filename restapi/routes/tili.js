var express = require('express');
var router = express.Router();
var pool = require('../db_handler')();
var { inspect_jwt } = require('../login_handler');

router.get('/', function (req, res, next) {
    try {
        var card_num = inspect_jwt(req.header('jwt-token'));
        pool.getConnection(async function (err, connection) {
            if (err) throw err;
            connection.promise().query('SELECT * from Tili where Tilinumero=' + "\'" + req.body.tili + "\'").then(rows => {
                console.log(card_num)
                console.log(rows[0][0].idKortti)
                connection.promise().query('SELECT * from Kortti where idKortti=' + rows[0][0].idKortti).then(rows2 => {
                    if (card_num == rows2[0][0].Korttinumero)
                        res.send(rows[0][0])

                    else res.send("Eipä ollu sun tili")
                });
            });
        });
    } catch (err) {
        res.status(403).send(err);
        return;
    }

});

module.exports = router;

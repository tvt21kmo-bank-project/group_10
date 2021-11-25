var express = require('express');
var router = express.Router();
var pool = require('../db_handler')();
var { inspect_jwt } = require('../login_handler');

router.get('/', function (req, res, next) {
    try {
        var card_num = inspect_jwt(req.header('jwt-token'));
        pool.getConnection(async function (err, connection) {
            if (err) throw err;
            connection.promise().query('SELECT * from Kortti where Korttinumero=' + card_num).then(rows => {
                console.log(rows[0][0].idKortti);
                connection.promise().query('SELECT * from Tili where idKortti=' + rows[0][0].idKortti).then(rows => {
                    var tili_list = [];
                    console.log(rows)
                    for (var tili in rows[0]) {
                        console.log(rows[0][tili].Tilinumero + ' tilinro');
                        tili_list.push(rows[0][tili].Tilinumero);
                    }
                    res.send(tili_list);
                    return;
                });
            });
        });
    } catch (err) {
        res.status(403).send(err);
        return;
    }

});

module.exports = router;

var express = require('express');
var router = express.Router();
var pool = require('../db_handler')();
var { inspect_jwt } = require('../login_handler');

router.post('/', function (req, res, next) {
    try {
        var card_num = inspect_jwt(req.header('jwt-token'));
        pool.getConnection(async function (err, connection) {
            if (err) throw err;
            connection.promise().query('SELECT * from Kortti where Korttinumero=' + "\'" + card_num + "\'").then(rows => {
                console.log(card_num)
                var tilinropool = "0123456789"
                var tilinro = 'FI'
                for (var i = 0; i < 9; i++) {
                    tilinro += tilinropool.charAt(Math.floor(Math.random() * 9));
                }
                if (req.body.accountType == "DEBIT") {
                    connection.promise().query('INSERT INTO Tili (idOmistaja, Tilinumero, Saldo, Kortin_tyyppi, idKortti) VALUES (\'' +
                        rows[0][0].idAsiakas + "', '" + tilinro + "', '" + 0 + "', '" + req.body.accountType +
                        "', (SELECT idKortti from Kortti where Korttinumero='" + card_num + "') )").then(
                            res.send("{\"status\":\"success\", \"accountnum\":\"" + tilinro + "\"}")
                        );
                }
                else if (req.body.accountType == "CREDIT") {
                    connection.promise().query('INSERT INTO Tili (idOmistaja, Tilinumero, Saldo, Kortin_tyyppi, Luottoraja, idKortti) VALUES (\'' +
                        rows[0][0].idAsiakas + "', '" + tilinro + "', '" + req.body.accountType + "', '" + req.body.creditLimit +
                        "', (SELECT idKortti from Kortti where Korttinumero='" + card_num + "') )").then(
                            res.send("{\"status\":\"success\", \"accountnum\":\"" + tilinro + "\"}")
                        );
                }
            });
        });
    } catch (err) {
        res.status(403).send(err);
        return;
    }

});

module.exports = router;

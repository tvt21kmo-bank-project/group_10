var express = require('express');
var router = express.Router();
var pool = require('../db_handler')();
var { inspect_jwt } = require('../login_handler');

router.post('/', function (req, res, next) {
    try {
        var card_num = inspect_jwt(req.header('jwt-token'));
        pool.getConnection(async function (err, connection) {
            if (err) throw err;
            connection.promise().query('SELECT * from Tili where Tilinumero=' + "\'" + req.body.tili + "\'").then(rows => {
                console.log(card_num)
                console.log(rows[0][0].idKortti)
                connection.promise().query('SELECT * from Tilitapahtumat where idTili=' + rows[0][0].idTili).then(rows2 => {
                    connection.promise().query('SELECT * from Kortti where idKortti=' + rows[0][0].idKortti).then(rows3 => {
                        if (rows3[0][0].Korttinumero == card_num) {
                            if (rows[0][0].Kortin_tyyppi == "DEBIT") {
                                if (rows[0][0].Saldo >= req.body.maara) {
                                    connection.promise().query('UPDATE Tili SET Saldo=Saldo - ' + req.body.maara + ' WHERE idTili=' + rows[0][0].idTili).then(rows4 => {
                                        connection.promise().query(
                                            'INSERT INTO Tilitapahtumat (Paivays, Tapahtuma, Rahamaara, Tilitapahtuma, idTili, idKortti) VALUES ' +
                                            "('" + new Date().toISOString().slice(0, 19).replace('T', ' ') + "', " + "'Nosto', '" + rows[0][0].Saldo + "', '" + req.body.maara + "', '" + rows[0][0].idTili + "', '" + rows[0][0].idKortti + "')"
                                        );
                                        res.send("Success")
                                    });
                                }
                                else {
                                    res.send("Failed not enough funds.")
                                }
                            }
                            if (rows[0][0].Kortin_tyyppi == "CREDIT") {
                                if (rows[0][0].Saldo + rows[0][0].Luottoraja >= req.body.maara) {
                                    connection.promise().query('UPDATE Tili SET Saldo=Saldo - ' + req.body.maara + ' WHERE idTili=' + rows[0][0].idTili).then(rows4 => {
                                        connection.promise().query(
                                            'INSERT INTO Tilitapahtumat (Paivays, Tapahtuma, Rahamaara, Tilitapahtuma, idTili, idKortti) VALUES ' +
                                            "('" + new Date().toISOString().slice(0, 19).replace('T', ' ') + "', " + "'Nosto', '" + rows[0][0].Saldo + "', '" + req.body.maara + "', '" + rows[0][0].idTili + "', '" + rows[0][0].idKortti + "')"
                                        );
                                        res.send("Success")
                                    });
                                }
                                else {
                                    res.send("Failed not enough funds.")
                                }
                            }
                        }
                    });
                });
            });
        });
    } catch (err) {
        res.status(403).send(err);
        return;
    }

});

module.exports = router;

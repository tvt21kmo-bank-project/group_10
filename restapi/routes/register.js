// 15 char pitkä random string saltiksi ja user inputtina loput
var express = require('express');
var router = express.Router();
var pool = require('../db_handler')();
var { sign_jwt } = require('../login_handler');
const { createHash, randomBytes } = require("crypto");

router.post('/', function (req, res, next) {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        console.log(req.headers)
        console.log(req.body)
        if (!req.body.passwd || !req.body.name || !req.body.lastName || !req.body.accountType) {
            res.status(401).send('please provide first and last name, type of account you want to regiser, and PIN for the card')
            if (req.body.accountType == "CREDIT" && !req.body.creditLimit) {
                res.status(401).send('please provide credit limit for creditcards')
            }
        }
        connection.promise().query("INSERT INTO Asiakas (Etunimi, Sukunimi) VALUES ('" + req.body.name + "', '" + req.body.lastName + "')").then(
            connection.promise().query("SELECT idAsiakas FROM Asiakas WHERE Etunimi='" + req.body.name + "' and Sukunimi='" + req.body.lastName + "'").then(id => {
                var tilinropool = "0123456789"
                var tilinro = 'FI'
                var korttinro = ''
                for (var i = 0; i < 9; i++) {
                    tilinro += tilinropool.charAt(Math.floor(Math.random() * 9));
                }
                for (var i = 0; i < 6; i++) {
                    korttinro += tilinropool.charAt(Math.floor(Math.random() * 9))
                }
                var salt = randomBytes(15).toString('hex');
                var hashedpin = createHash('sha256').update(req.body.passwd + salt).digest('hex')
                console.log(id[0][0].idAsiakas);
                connection.promise().query("INSERT INTO Kortti (Korttinumero, PIN, salt, idAsiakas) VALUES ('" + korttinro + "', '" + hashedpin + "', '" + salt + "', '" + id[0][0].idAsiakas + "')").then(
                    connection.promise().query("SELECT idKortti from Kortti where PIN='" + hashedpin + "'").then(idKortti => {
                        if (req.body.accountType == "DEBIT") {
                            connection.promise().query("INSERT INTO Tili (idOmistaja, Tilinumero, Saldo, Kortin_tyyppi, idKortti) VALUES ('" +
                                id[0][0].idAsiakas + "', '" + tilinro + "', '" + 0 + "', '" + req.body.accountType + "', '" + idKortti[0][0].idKortti + "')").then(
                                    res.send("success")
                                )
                        }
                        else if (req.body.accountType == "CREDIT") {
                            connection.promise().query("INSERT INTO Tili (idOmistaja, Tilinumero, Saldo, Kortin_tyyppi, Luottoraja, idKortti) VALUES ('" +
                                id[0][0].idAsiakas + "', '" + tilinro + "', '" + 0 + "', '" + req.body.accountType + "', '" + req.body.creditLimit + "', '" + idKortti[0][0].idKortti + "')").then(
                                    res.send("{\"status\":\"success\", \"cardnum\":\"" + korttinro + "\", \"accountnum\":\"" + tilinro + "\"}")
                                )
                        }
                    })
                )
            })
        )
    });
});

module.exports = router;

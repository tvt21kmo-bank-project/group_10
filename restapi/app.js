module.exports = () => {
    var express = require('express');
    var path = require('path');
    var cookieParser = require('cookie-parser');
    var logger = require('morgan');

    var indexRouter = require('./routes/index');
    var usersRouter = require('./routes/users');
    var loginRouter = require('./routes/login');
    var tilitRouter = require('./routes/tilit');
    var tiliRouter = require('./routes/tili');
    var tilitapahtumatRouter = require('./routes/tili_tapahtuma');
    var talletusRouter = require('./routes/talletus');
    var nostoRouter = require('./routes/nosto');
    var registerRouter = require('./routes/register');
    var uusi_tiliRouter = require('./routes/uusi_tili');

    var app = express();

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/login', loginRouter);
    app.use('/tilit', tilitRouter);
    app.use('/tili', tiliRouter);
    app.use('/tilitapahtumat', tilitapahtumatRouter);
    app.use('/talletus', talletusRouter);
    app.use('/nosto', nostoRouter);
    app.use('/register', registerRouter);
    app.use('/uusitili', uusi_tiliRouter);

    return app;
}

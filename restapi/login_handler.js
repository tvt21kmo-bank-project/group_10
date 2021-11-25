var jwt = require('jsonwebtoken');

module.exports = {
    inspect_jwt: function (given_token) {
        try {
            if (jwt.verify(given_token, process.env.JWT_SECRET)) {
                var user = jwt.decode(given_token, { complete: true });
                console.log(user.payload.card_num + ' has successfully logged in.')
                return user.payload.card_num;
            }
        } catch (error) {
            throw 'You are not logged in.';
        }
    },
    sign_jwt: function (user) {
        signed_token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), card_num: user, issuer: 'FooBank' }, process.env.JWT_SECRET);
        return signed_token;
    }
}

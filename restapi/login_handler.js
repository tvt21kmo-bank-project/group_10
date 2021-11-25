var jwt = require('jsonwebtoken');

var jwt_list = []
module.exports = {
    inspect_jwt: function (given_token) {
        if (jwt_list.includes(given_token)) {
            try {
                jwt.verify(given_token, process.env.JWT_SECRET)
                console.log('User has logged in.')
            } catch (error) {
                throw 'You are not logged in.';
            }
        }
    },
    sign_jwt: function (user) {
        signed_token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), issuer: 'FooBank' }, process.env.JWT_SECRET);
        jwt_list.push(signed_token);
        return signed_token;
    }
}

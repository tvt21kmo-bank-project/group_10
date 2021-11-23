var { createHash } = require('crypto');

var jwt_list = []
module.exports = {
    add_jwt: function (jwt) {
        jwt_list.push(jwt);
    },
    hash: function (string, salt) {
        return createHash('sha256').update(string + salt).digest('hex');
    },
    inspect_jwt: function (jwt) {
        if (jwt_list.includes(jwt)) {
            console.log('User has logged in.')
        }
        else {
            throw 'You are not logged in.';
        }
    }
}

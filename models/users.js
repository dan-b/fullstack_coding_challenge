var fs = require('fs');

var users = {
    data: JSON.parse(fs.readFileSync('data/users.json', 'utf8'))

};

module.exports = users;
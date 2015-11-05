var fs = require('fs');

var users = {
    data: JSON.parse(fs.readFileSync('data/users.json', 'utf8')),
    get: function (index, count) {
        var begin = index;
        var end = index + count;
        console.log("users.get begin: " + begin + " end: " + end);
        return this.data.slice(begin, end);
    }
};

module.exports = users;
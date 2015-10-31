var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;
var router = express.Router();
app.use('/', router);
app.use(express.static(__dirname + '/public'));
var users = require('./models/users');
router.get('/api/users', function(req, res) {
    res.json(users.data);
});
router.get('/api/users/:count', function(req, res) {
    console.log("req.params: " + JSON.stringify(req.params));
    res.json({});
});
app.listen(port);
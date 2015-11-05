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
    console.log("GET /api/users \r\nreq.params: " + JSON.stringify(req.params));
    res.json(users.data);
});
router.get('/api/users/:index/:count', function(req, res) {
    console.log("GET /api/users/:index/:count \r\nreq.params: " + JSON.stringify(req.params));
    console.log("parsed index: " + Number.parseInt(req.params.index) + " " + typeof(Number.parseInt(req.params.index)));
    console.log("parsed count: " + Number.parseInt(req.params.count) + " " + typeof(Number.parseInt(req.params.count)));
    res.json(users.get(Number.parseInt(req.params.index), Number.parseInt(req.params.count)));
});
app.listen(port);
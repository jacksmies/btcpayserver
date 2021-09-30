/*
 * Express webhook server for testing of BTCPayserver webhooks
 * run with node express-wbhook.js
 */
var express = require('express'),
    app = express(),
    port = 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.post('/', function (req, res) {
    var body = req.body;

    console.log(body);

    res.json({
        message: 'ok got it!'
    });
});

var server = app.listen(port, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)

});
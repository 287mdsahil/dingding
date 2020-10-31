var express = require('express');
var register = require('./register');

var app = express();
app.use(express.json());

app.get('/users', (req, res) => {
    var users = register.getUsersSync();
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(users));
    res.end();
});

app.post('/users/add', (req, res) => {
    var user_id = req.body.user_id;
    var user_data = req.body.user_data;
    register.addUserSync(user_id, user_data);
    res.writeHead(200, {'Content-Type': 'application/json'});
    var users = register.getUsersSync();
    res.write(JSON.stringify(users));
    res.end();
});

app.post('/users/remove', (req, res) => {
    var user_id = req.body.user_id;
    register.removeUserSync(user_id);
    res.writeHead(200, {'Content-Type': 'application/json'});
    var users = register.getUsersSync();
    res.write(JSON.stringify(users));
    res.end();
});

var server = app.listen(5000, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Listening at http://%s:%s", host, port);
})

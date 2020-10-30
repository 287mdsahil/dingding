var express = require('express');
var register = require('./server/register');

var app = express();

function getUsers(req, res) {
    var users = register.getUsersSync();
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(users));
    res.end();
}

function addUser(req, res) {
    var user_id = "irin";
    var user_data = {"password": "test123"};
    register.addUserSync(user_id, user_data);
    res.writeHead(200, {'Content-Type': 'application/json'});
    var users = register.getUsersSync();
    res.write(JSON.stringify(users));
    res.end();
}

app.get('/users', getUsers);
app.post('/users/add', addUser);

var server = app.listen(8081, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log(server.address());
    console.log("Listening at http://%s:%s", host, port);
})

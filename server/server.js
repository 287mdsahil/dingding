var express = require('express');
var register = require('./register');
var cors = require('cors');
var path = require('path');

var app = express();
app.use(cors());
app.use(express.json());

app.options('/login', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
});

app.get('/users', (req, res) => {
    var users = register.getUsersSync();
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(users));
    res.end();
});

app.post('/user/login', (req, res) => {
    var user_id = req.body.user_id;
    var password = req.body.password;
    var user_data = register.getUserSync(user_id);
    var user = {"user_id": user_id, "user_data": user_data};
    if (user_data == undefined) {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end();
    } else if (password != user_data.password) {
        res.writeHead(401, {'Content-Type': 'application/json'});
        res.end();
    } else {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(user));
        res.end();
    }
});

app.get('/user/:id/connections', (req, res) => {
    var user_id = req.params.id;
    var connections = [];
    if (user_id != undefined)
        connections = register.getUserConnectionsSync(user_id);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(connections));
    res.end();
});

app.post('/user/:id/connections/add', (req, res) => {
    var user_id = req.params.id;
    var c_id = req.body.c_id;
    var c_data = req.body.c_data;
    console.log(user_id + ":" + c_id);
    if (user_id != undefined)
        register.addUserConnectionSync(user_id, c_id, c_data);
    res.writeHead(200);
    res.end();
});

app.post('/users/add', (req, res) => {
    var user_id = req.body.user_id;
    var user_data = req.body.user_data;
    register.addUserSync(user_id, user_data);
    res.writeHead(200, {'Content-Type': 'application/json', });
    var user_data = register.getUserSync(user_id);
    var user = {"user_id": user_id, "user_data": user_data};
    res.write(JSON.stringify(user));
    res.end();
});

app.post('/groups/add', (req, res) => {
    var group_id = req.body.group_id;
    var users = req.body.users;
    register.addGroupSync(group_id, users);
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


// socket server here ----------------------------------------------------

const onlineUsers = {};

const io = require('socket.io').listen(server);
io.origins('*:*');
io.on('connection', (socket) => {
    socket.on('user-connected', (user_id) => {
        if (user_id != null) {
            onlineUsers[user_id] = socket;
            console.log("Connected:" + user_id);
        }
    });

    socket.on('send-message', (message) => {
        console.log(message);
        if (message.type == 'u') {
            onlineUsers[message.receiver].emit('receive-message', message);
            console.log("Sending to : " + message.receiver);
        } else if (message.type == 'b')
            for (var user_id in onlineUsers) {
                if (user_id != message.sender) {
                    console.log("Sending to : " + user_id);
                    onlineUsers[user_id].emit('receive-message', message);
                }
            }
    });
});

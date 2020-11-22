var express = require('express');
var register = require('./register');
var cors = require('cors');
var path = require('path');

var app = express();
app.use(cors());
app.use(express.json());

// Serving client site 
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('/client/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.options('/api/login', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
});

app.get('/api/users', (req, res) => {
    var users = register.getUsersSync();
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(users));
    res.end();
});

app.post('/api/user/login', (req, res) => {
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

app.post('/api/group', (req, res) => {
    let c_id = req.body.c_id;
    let c_data = req.body.c_data;
    if (c_id == undefined || c_data == undefined || c_data.users === []) {
        res.end();
    } else {
        console.log(c_id, c_data);
        register.addGroupSync(c_id, c_data);
        for (let i = 0; i < c_data.users.length; i++) {
            console.log(c_data.users[i]);
            if (onlineUsers[c_data.users[i]] !== undefined) {
                onlineUsers[c_data.users[i]].emit('group-add', c_id);
                register.addUserConnectionSync(c_data.users[i], c_id, c_data);
            }
        }
        res.end();
    }
});

app.get('/api/user/:id/connections', (req, res) => {
    var user_id = req.params.id;
    var connections = [];
    if (user_id != undefined)
        connections = register.getUserConnectionsSync(user_id);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(connections));
    res.end();
});

app.post('/api/user/:id/connections/add', (req, res) => {
    var user_id = req.params.id;
    var c_id = req.body.c_id;
    var c_data = req.body.c_data;
    console.log(user_id + ":" + c_id);
    if (user_id != undefined)
        register.addUserConnectionSync(user_id, c_id, c_data);
    res.writeHead(200);
    res.end();
});

app.post('/api/users/add', (req, res) => {
    var user_id = req.body.user_id;
    var user_data = req.body.user_data;
    register.addUserSync(user_id, user_data);
    res.writeHead(200, {'Content-Type': 'application/json', });
    var user_data = register.getUserSync(user_id);
    var user = {"user_id": user_id, "user_data": user_data};
    res.write(JSON.stringify(user));
    res.end();
});

app.post('/api/users/remove', (req, res) => {
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
io.on('connection', (socket) => {
    let user_id = null;
    socket.on('user-connected', (id) => {
        if (id != null) {
            user_id = id;
            onlineUsers[user_id] = socket;
            console.log("Connected:" + user_id + ":" + socket.id);
        }
    });

    socket.on('send-message', (message) => {
        console.log(message);
        if (message.type == 'u' && onlineUsers[message.receiver] !== undefined) {
            onlineUsers[message.receiver].emit('receive-message', message);
            console.log("Sending to : " + message.receiver);
        } else if (message.type == 'b') {
            for (var user_id in onlineUsers) {
                if (user_id != message.sender) {
                    console.log("Sending to : " + user_id);
                    if (onlineUsers[user_id] !== undefined)
                        onlineUsers[user_id].emit('receive-message', message);
                }
            }
        } else if (message.type == 'm') {
            let users = register.getGroupMembersSync(message.receiver);
            console.log(users);
            if (users !== undefined) {
                for (let i = 0; i < users.length; i++)
                    if (users[i] !== message.sender && onlineUsers[users[i]] !== undefined)
                        onlineUsers[users[i]].emit('receive-message', message);
            }
        }
    });

    socket.on('disconnect', () => {
        console.log("Disconnected:" + user_id + ":" + socket.id);
        delete onlineUsers[user_id];
    });
});

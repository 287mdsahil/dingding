var express = require('express');
var register = require('./register');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(express.json());

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
    console.log(user_id);
    var connections = register.getUserConnectionsSync(user_id);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(connections));
    res.end();
});

app.post('/users/add', (req, res) => {
    var user_id = req.body.user_id;
    var user_data = req.body.user_data;
    user_data.connections = [];
    register.addUserSync(user_id, user_data);
    res.writeHead(200, {'Content-Type': 'application/json', });
    var user_data = register.getUserSync(user_id);
    var user = {"user_id": user_id, "user_data": user_data};
    res.write(JSON.stringify(user));
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


// socket server here ----------------------------------------------------

const onlineUsers = {};

const io = require('socket.io')(5001);
io.origins('*:*');
io.on('connection', (socket) => {
    console.log("Connection made");
    socket.on('user-connected', (user_id) => {
        if (user_id != null) {
            onlineUsers[user_id] = socket;
        }
    });
});




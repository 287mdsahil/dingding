var fs = require('fs');

var filename = "register_data.json";

function getUsersSync() {
    var data = fs.readFileSync(
        __dirname + '/' + filename,
        {encoding: 'utf8', flag: 'r+'}
    );
    return JSON.parse(data);
}

function getUserSync(user_id) {
    var data = getUsersSync();
    return data[user_id];
}

function getUserConnectionsSync(user_id) {
    var data = getUserSync(user_id);
    return data.connections;
}

function setUsersSync(data) {
    fs.writeFileSync(
        __dirname + '/' + filename,
        JSON.stringify(data),
        {flag: 'w+'}
    )
}

function addUserSync(user_id, user_data) {
    var data = getUsersSync();
    data[user_id] = user_data;
    setUsersSync(data);
}

function removeUserSync(user_id) {
    var data = getUsersSync();
    delete data[user_id];
    setUsersSync(data);
}

module.exports.getUsersSync = getUsersSync;
module.exports.getUserSync = getUserSync;
module.exports.addUserSync = addUserSync;
module.exports.removeUserSync = removeUserSync;
module.exports.getUserConnectionsSync = getUserConnectionsSync;

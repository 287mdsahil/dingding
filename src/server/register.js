var fs = require('fs');

var filename = "register_data.json";

function getUsersSync() {
    var data = fs.readFileSync(
        __dirname + '/' + filename,
        {encoding: 'utf8', flag: 'r+'}
    );
    return JSON.parse(data);
}

function addUserSync(user_id, user_data) {
    var data = getUsersSync();
    data[user_id] = user_data;
    fs.writeFileSync(
        __dirname + '/' + filename,
        JSON.stringify(data),
        {flag: 'w+'}
    )
}

module.exports.getUsersSync = getUsersSync;
module.exports.addUserSync = addUserSync;

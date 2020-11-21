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
    if (user_id === undefined)
        return {};
    var data = getUserSync(user_id);
    if (data === undefined)
        return {};
    else
        return data.connections;
}

function addUserConnectionSync(user_id, c_id, c_data) {
    if (getUserSync(c_id) != undefined) {
        if (getUserSync(user_id) != undefined && user_id !== c_id) {
            var data = getUsersSync();
            data[user_id]["connections"][c_id] = c_data;
            setUsersSync(data);
            return data[user_id]["connections"];
        }
    }
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
    user_data.connections = {"broadcast": {"type": "b", }, };
    data[user_id] = user_data;
    setUsersSync(data);
}

function addGroupSync(group_id, group_data) {
    var data = getUsersSync();
    data[group_id] = group_data;
    setUsersSync(data);
}

function getGroupMembersSync(group_id) {
    var data = getUsersSync();
    return data[group_id].users;
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
module.exports.addUserConnectionSync = addUserConnectionSync;
module.exports.addGroupSync = addGroupSync;
module.exports.getGroupMembersSync = getGroupMembersSync;

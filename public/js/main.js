var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "socket.io-client", "jquery", "./actions"], function (require, exports, socket_io_client_1, jquery_1, actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    socket_io_client_1 = __importDefault(socket_io_client_1);
    jquery_1 = __importDefault(jquery_1);
    var _to_username = '';
    var _to_userpic = '';
    var socketid = '';
    var socketConnection = socket_io_client_1.default();
    jquery_1.default(function () {
        actions_1.ajax_text(jquery_1.default, "/islogin").then(function (islogin_res) {
            if (islogin_res.status) {
                initsocket(islogin_res.username, islogin_res.userpic, islogin_res.userlist);
            }
            else {
                jquery_1.default(".login-btn input").on("click", function () {
                    var userpic = jquery_1.default(".login-user-pic img")[0];
                    var username = jquery_1.default(".login-user input").val();
                    if (userpic.src && username) {
                        actions_1.ajax_text(jquery_1.default, "/login", { username: username, userpic: userpic.src }).then(function (login_res) {
                            if (login_res.status) {
                                initsocket(login_res.username, login_res.userpic, login_res.userlist);
                            }
                        });
                    }
                });
            }
        });
    });
    function initsocket(username, userpic, userlistdata) {
        jquery_1.default(".shade").css("display", "none");
        jquery_1.default(".left-top .name").text(username);
        var img = jquery_1.default(".left-top .pic img")[0];
        img.src = userpic;
        jquery_1.default(".user-list").empty();
        jquery_1.default(".user-list").append(renderuserlist(userlistdata));
        socketConnection.emit('login', { userpic: userpic, username: username, socketid: socketConnection.json.id });
        socketConnection.on('connect', function (e) {
        });
        socketConnection.on('userlist', function (e) {
            var data = e;
            jquery_1.default(".user-list").empty();
            jquery_1.default(".user-list").append(renderuserlist(data));
        });
        socketConnection.on('message', function (e) {
            var data = e;
            jquery_1.default(".message-list").empty();
            jquery_1.default(".message-list").append(rendermessagelist(data, username, userpic));
        });
        jquery_1.default(".user-list").on("click", ".user-item-shade", function (e) {
            socketid = e.target.dataset.id;
            _to_username = e.target.dataset.username;
            var _userpic = jquery_1.default(".user-list .pic img")[0];
            _to_userpic = _userpic.src;
            jquery_1.default(".right-top p").text("TO\uFF1A" + _to_username);
            actions_1.ajax_text(jquery_1.default, "/messagelist").then(function (list) {
                jquery_1.default(".message-list").empty();
                jquery_1.default(".message-list").append(rendermessagelist(list, username, userpic));
            });
        });
        jquery_1.default(".send").on("click", function () {
            var content = jquery_1.default(".editor").html();
            var msg = content.replace(/<div>/gm, "").replace(/<\/div>/gm, "\n").replace(/<br>/gm, "");
            socketConnection.emit('sendmsg', { msg: msg, socketid: socketid, to: _to_username, from: username });
            jquery_1.default(".editor").html('');
        });
    }
    function renderuserlist(data) {
        var useritem = '';
        for (var i in data) {
            var _username = data[i].username, _pic = data[i].userpic, _socketid = data[i].socketid, status_1 = data[i].status;
            if (status_1 == 'true') {
                useritem += "<li class=\"user-item online\">\n\t\t\t\t\t\t\t<div class=\"pic\">\n\t\t\t\t\t\t\t\t<img src=\"" + _pic + "\" alt=\"\">\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"name\">" + _username + "</div>\n\t\t\t\t\t\t\t<div class=\"user-item-shade\" data-id=\"" + _socketid + "\" data-username=\"" + _username + "\"></div>\n\t\t\t\t\t\t</li>";
            }
            else {
                useritem += "<li class=\"user-item offline\">\n\t\t\t\t\t\t\t<div class=\"pic\">\n\t\t\t\t\t\t\t\t<img src=\"" + _pic + "\" alt=\"\">\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"name\">" + _username + "</div>\n\t\t\t\t\t\t\t<div class=\"user-item-shade\" data-id=\"" + _socketid + "\" data-username=\"" + _username + "\"></div>\n\t\t\t\t\t\t</li>";
            }
        }
        return useritem;
    }
    function rendermessagelist(data, username, userpic) {
        var messageitem = '';
        for (var i in data) {
            var to = data[i].to;
            var _msg = data[i].msg;
            if (username == to) {
                messageitem += "<div class=\"to\">\n\t\t\t\t\t\t\t\t<div class=\"pic\">\n\t\t\t\t\t\t\t\t\t<img src=\"" + userpic + "\" alt=\"\">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"content\">" + _msg + "</div>\n\t\t\t\t\t\t\t</div>";
            }
            else {
                messageitem += "<div class=\"from\">\n\t\t\t\t\t\t\t\t<div class=\"pic\">\n\t\t\t\t\t\t\t\t\t<img src=\"" + _to_userpic + "\" alt=\"\">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"content\">" + _msg + "</div>\n\t\t\t\t\t\t\t</div>";
            }
        }
        return messageitem;
    }
});

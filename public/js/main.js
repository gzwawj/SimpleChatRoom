var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "socket.io-client", "jquery", "./actions"], function (require, exports, socket_io_client_1, jquery_1, actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    socket_io_client_1 = __importDefault(socket_io_client_1);
    jquery_1 = __importDefault(jquery_1);
    var _to_username = '';
    var socketid = '';
    var socketConnection = socket_io_client_1.default();
    jquery_1.default(function () {
        actions_1.ajax_text(jquery_1.default, "/islogin").then(function (islogin_res) {
            if (islogin_res.status) {
                initsocket(islogin_res.username, islogin_res.userpic);
            }
            else {
                jquery_1.default(".login-btn input").on("click", function () {
                    var userpic = jquery_1.default(".login-user-pic img")[0];
                    var username = jquery_1.default(".login-user input").val();
                    if (userpic.src && username) {
                        actions_1.ajax_text(jquery_1.default, "/login", { username: username, userpic: userpic.src }).then(function (login_res) {
                            if (login_res.status) {
                                initsocket(login_res.username, login_res.userpic);
                            }
                        });
                    }
                });
            }
        });
    });
    function initsocket(username, userpic) {
        jquery_1.default(".shade").css("display", "none");
        socketConnection.emit('login', { userpic: userpic, username: username, socketid: socketConnection.json.id });
        socketConnection.on('connect', function (e) {
        });
        socketConnection.on('userlist', function (e) {
            var useritem = '';
            var data = e;
            for (var i in data) {
                var _username = data[i][0], _pic = data[i][1], _socketid = data[i][2], status_1 = data[i][3];
                if (status_1 == 'true') {
                    useritem += "<li class=\"user-item online\">\n\t\t\t\t\t\t\t\t<div class=\"pic\">\n\t\t\t\t\t\t\t\t\t<img src=\"" + _pic + "\" alt=\"\">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"name\">" + _username + "</div>\n\t\t\t\t\t\t\t\t<div class=\"user-item-shade\" data-id=\"" + _socketid + "\" data-username=\"" + _username + "\"></div>\n\t\t\t\t\t\t\t</li>";
                }
                else {
                    useritem += "<li class=\"user-item offline\">\n\t\t\t\t\t\t\t\t<div class=\"pic\">\n\t\t\t\t\t\t\t\t\t<img src=\"" + _pic + "\" alt=\"\">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t<div class=\"name\">" + _username + "</div>\n\t\t\t\t\t\t\t\t<div class=\"user-item-shade\" data-id=\"" + _socketid + "\" data-username=\"" + _username + "\"></div>\n\t\t\t\t\t\t\t</li>";
                }
            }
            jquery_1.default(".user-list").empty();
            jquery_1.default(".user-list").append(useritem);
        });
        socketConnection.on('message', function (e) {
            var messageitem = '';
            for (var i in e.data) {
                var tu = e.data[i].tu;
                var _pic = e.data[i].userpic;
                var _content = e.data[i].content;
                if (tu) {
                    messageitem += "<div class=\"to\">\n\t\t\t\t\t\t\t\t\t<div class=\"pic\">\n\t\t\t\t\t\t\t\t\t\t<img src=\"" + _pic + "\" alt=\"\">\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"content\">" + _content + "</div>\n\t\t\t\t\t\t\t\t</div>";
                }
                else {
                    messageitem += "<div class=\"from\">\n\t\t\t\t\t\t\t\t\t<div class=\"pic\">\n\t\t\t\t\t\t\t\t\t\t<img src=\"" + _pic + "\" alt=\"\">\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class=\"content\">" + _content + "</div>\n\t\t\t\t\t\t\t\t</div>";
                }
            }
            jquery_1.default(".message-list").empty();
            jquery_1.default(".message-list").append(messageitem);
        });
        jquery_1.default(".user-list").on("click", ".user-item-shade", function (e) {
            socketid = e.target.dataset.id;
            _to_username = e.target.dataset.username;
            console.log(socketid, _to_username);
            jquery_1.default(".right-top p").text("TO\uFF1A" + _to_username);
            socketConnection.emit('useritem', { to: _to_username, from: username });
        });
        jquery_1.default(".send").on("click", function () {
            var content = jquery_1.default(".editor").html();
            var msg = content.replace(/<div>/gm, "").replace(/<\/div>/gm, "\n").replace(/<br>/gm, "");
            socketConnection.emit('sendmsg', { msg: msg, socketid: socketid, to: _to_username, from: username });
            jquery_1.default(".editor").html('');
        });
    }
});

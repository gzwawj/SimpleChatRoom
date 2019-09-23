var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "socket.io", "jquery"], function (require, exports, socket_io_1, jquery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    socket_io_1 = __importDefault(socket_io_1);
    jquery_1 = __importDefault(jquery_1);
    jquery_1.default(function () {
        jquery_1.default(".login-btn input").on("click", function () {
            var userpic = jquery_1.default(".login-user-pic img")[0];
            var username = jquery_1.default(".login-user input").val();
            var _to_username = '';
            var socketid = '';
            if (userpic.src && username) {
                jquery_1.default(".shade").css("display", "none");
                var socket_1 = socket_io_1.default();
                socket_1.on('connect', function (e) {
                });
                socket_1.on('login', function (e) {
                    socketid = e.userid;
                    socket_1.emit('login', { userpic: userpic.src, username: username, socketid: socketid });
                });
                socket_1.on('userlist', function (e) {
                    var useritem = '';
                    for (var i in e.data) {
                        var status_1 = e.data[i].status;
                        var _pic = e.data[i].userpic;
                        var _username = e.data[i].username;
                        var _socketid = e.data[i].socketid;
                        if (status_1) {
                            useritem +=
                                "\n\t\t\t\t\t\t<li class=\"user-item online\">\n\t\t\t\t\t\t\t<div class=\"pic\">\n\t\t\t\t\t\t\t\t<img src=\"" + _pic + "\" alt=\"\">\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"name\">" + _username + "</div>\n\t\t\t\t\t\t\t<div class=\"user-item-shade\" data-id=\"" + _socketid + "\" data-username=\"" + _username + "\"></div>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t";
                        }
                        else {
                            useritem +=
                                "\n\t\t\t\t\t\t<li class=\"user-item offline\">\n\t\t\t\t\t\t\t<div class=\"pic\">\n\t\t\t\t\t\t\t\t<img src=\"" + _pic + "\" alt=\"\">\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"name\">" + _username + "</div>\n\t\t\t\t\t\t\t<div class=\"user-item-shade\" data-id=\"" + _socketid + "\" data-username=\"" + _username + "\"></div>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t";
                        }
                    }
                    jquery_1.default(".user-list").empty();
                    jquery_1.default(".user-list").append(useritem);
                });
                socket_1.on('message', function (e) {
                    var messageitem = '';
                    for (var i in e.data) {
                        var tu = e.data[i].tu;
                        var _pic = e.data[i].userpic;
                        var _content = e.data[i].content;
                        if (tu) {
                            messageitem +=
                                "\n\t\t\t\t\t\t<div class=\"to\">\n\t\t\t\t\t\t\t<div class=\"pic\">\n\t\t\t\t\t\t\t\t<img src=\"" + _pic + "\" alt=\"\">\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"content\">" + _content + "</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t";
                        }
                        else {
                            messageitem +=
                                "\n\t\t\t\t\t\t<div class=\"from\">\n\t\t\t\t\t\t\t<div class=\"pic\">\n\t\t\t\t\t\t\t\t<img src=\"" + _pic + "\" alt=\"\">\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class=\"content\">" + _content + "</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t";
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
                    socket_1.emit('useritem', { to: _to_username, from: username });
                });
                jquery_1.default(".send").on("click", function () {
                    var content = jquery_1.default(".editor").html();
                    var msg = content.replace(/<div>/gm, "").replace(/<\/div>/gm, "\n").replace(/<br>/gm, "");
                    socket_1.emit('sendmsg', { msg: msg, socketid: socketid, to: _to_username, from: username });
                    jquery_1.default(".editor").html('');
                });
            }
        });
    });
});

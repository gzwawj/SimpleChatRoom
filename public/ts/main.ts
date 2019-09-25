import io from 'socket.io-client'
import $ from 'jquery'
import { ajax_text } from './actions';

let _to_username = ''
let _to_userpic = ''
let socketid: string = ''
let socketConnection: any = io();

$(function () {
	ajax_text($, `/islogin`).then((islogin_res: any) => {
		if (islogin_res.status) {
			initsocket(islogin_res.username, islogin_res.userpic, islogin_res.userlist)
		} else {
			$(".login-btn input").on("click", () => {
				let userpic: any = $(".login-user-pic img")[0]
				let username = $(".login-user input").val()
				if (userpic.src && username) {
					ajax_text($, `/login`, { username: username, userpic: userpic.src }).then((login_res: any) => {
						if (login_res.status) {
							initsocket(login_res.username, login_res.userpic, login_res.userlist)
						}
					})
				}
			})
		}
	})
});

function initsocket(username: string, userpic: string, userlistdata: any) {
	$(".shade").css("display", "none")
	$(".left-top .name").text(username)
	let img: any = $(".left-top .pic img")[0]
	img.src = userpic
	// 渲染用户列表
	$(".user-list").empty()
	$(".user-list").append(renderuserlist(userlistdata))

	socketConnection.emit('login', { userpic: userpic, username: username, socketid: socketConnection.json.id })

	socketConnection.on('connect', (e: any) => {

	})
	// 用户列表
	socketConnection.on('userlist', (e: any) => {
		let data = e
		$(".user-list").empty()
		$(".user-list").append(renderuserlist(data))
	})
	// 消息列表
	socketConnection.on('message', (e: any) => {
		let data = e
		$(".message-list").empty()
		$(".message-list").append(rendermessagelist(data, username, userpic))
	})
	$(".user-list").on("click", ".user-item-shade", (e) => {
		socketid = e.target.dataset.id
		_to_username = e.target.dataset.username
		let _userpic: any = $(".user-list .pic img")[0]
		_to_userpic = _userpic.src
		$(".right-top p").text(`TO：${_to_username}`)
		//获取私聊对象与自己的聊天内容(to为私聊对象)
		// socketConnection.emit('useritem', { to: _to_username, from: username, socketid: socketid })
		ajax_text($, `/messagelist`).then((list: any) => {
			$(".message-list").empty()
			$(".message-list").append(rendermessagelist(list, username, userpic))
		})
	})
	$(".send").on("click", () => {
		let content = $(".editor").html()
		let msg = content.replace(/<div>/gm, ``).replace(/<\/div>/gm, `\n`).replace(/<br>/gm, ``)
		socketConnection.emit('sendmsg', { msg: msg, socketid: socketid, to: _to_username, from: username })
		$(".editor").html('')
	})
}
//渲染用户列表
function renderuserlist(data: any) {
	let useritem = ''
	for (let i in data) {
		let _username = data[i].username, _pic = data[i].userpic, _socketid = data[i].socketid, status = data[i].status
		if (status == 'true') {
			useritem += `<li class="user-item online">
							<div class="pic">
								<img src="${_pic}" alt="">
							</div>
							<div class="name">${_username}</div>
							<div class="user-item-shade" data-id="${_socketid}" data-username="${_username}"></div>
						</li>`
		} else {
			useritem += `<li class="user-item offline">
							<div class="pic">
								<img src="${_pic}" alt="">
							</div>
							<div class="name">${_username}</div>
							<div class="user-item-shade" data-id="${_socketid}" data-username="${_username}"></div>
						</li>`
		}
	}
	return useritem
}
//渲染消息
function rendermessagelist(data: any, username: string, userpic: string) {
	let messageitem = ''
	for (let i in data) {
		let to = data[i].to
		let _msg = data[i].msg
		if (username == to) {
			messageitem += `<div class="to">
								<div class="pic">
									<img src="${userpic}" alt="">
								</div>
								<div class="content">${_msg}</div>
							</div>`
		} else {
			messageitem += `<div class="from">
								<div class="pic">
									<img src="${_to_userpic}" alt="">
								</div>
								<div class="content">${_msg}</div>
							</div>`
		}
	}
	return messageitem
}
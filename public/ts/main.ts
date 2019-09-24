import io from 'socket.io-client'
import $ from 'jquery'
import { ajax_text } from './actions';

let _to_username = ''
let socketid: string = ''
let socketConnection: any = io();

$(function () {
	ajax_text($, `/islogin`).then((islogin_res: any) => {
		if (islogin_res.status) {
			initsocket(islogin_res.username, islogin_res.userpic)
		} else {
			$(".login-btn input").on("click", () => {
				let userpic: any = $(".login-user-pic img")[0]
				let username = $(".login-user input").val()
				if (userpic.src && username) {
					ajax_text($, `/login`, { username: username, userpic: userpic.src }).then((login_res: any) => {
						if (login_res.status) {
							initsocket(login_res.username, login_res.userpic)
						}
					})
				}
			})
		}
	})
});

function initsocket(username: string, userpic: string) {
	$(".shade").css("display", "none")
	socketConnection.emit('login', { userpic: userpic, username: username, socketid: socketConnection.json.id })

	socketConnection.on('connect', (e: any) => {

	})
	socketConnection.on('userlist', (e: any) => {
		let useritem: string = ''
		let data = e
		for (let i in data) {
			let _username = data[i][0], _pic = data[i][1], _socketid = data[i][2], status = data[i][3]
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
		$(".user-list").empty()
		$(".user-list").append(useritem)
	})
	socketConnection.on('message', (e: any) => {
		let messageitem: string = ''
		for (let i in e.data) {
			let tu = e.data[i].tu
			let _pic = e.data[i].userpic
			let _content = e.data[i].content
			if (tu) {
				messageitem += `<div class="to">
									<div class="pic">
										<img src="${_pic}" alt="">
									</div>
									<div class="content">${_content}</div>
								</div>`
			} else {
				messageitem += `<div class="from">
									<div class="pic">
										<img src="${_pic}" alt="">
									</div>
									<div class="content">${_content}</div>
								</div>`
			}
		}

		$(".message-list").empty()
		$(".message-list").append(messageitem)
	})
	$(".user-list").on("click", ".user-item-shade", (e) => {
		socketid = e.target.dataset.id
		_to_username = e.target.dataset.username
		console.log(socketid, _to_username)
		$(".right-top p").text(`TO：${_to_username}`)
		//获取私聊对象与自己的聊天内容(to为私聊对象)
		socketConnection.emit('useritem', { to: _to_username, from: username })
	})
	$(".send").on("click", () => {
		let content = $(".editor").html()
		let msg = content.replace(/<div>/gm, ``).replace(/<\/div>/gm, `\n`).replace(/<br>/gm, ``)
		socketConnection.emit('sendmsg', { msg: msg, socketid: socketid, to: _to_username, from: username })
		$(".editor").html('')
	})
}
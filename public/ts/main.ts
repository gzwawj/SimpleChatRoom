import io from 'socket.io'
import $ from 'jquery'

$(function () {
	$(".login-btn input").on("click", () => {
		let userpic: any = $(".login-user-pic img")[0]
		let username = $(".login-user input").val()
		let _to_username = ''
		let socketid: string = ''

		if (userpic.src && username) {
			$(".shade").css("display", "none")
			let socket = io();
			socket.on('connect', (e: any) => {

			})
			socket.on('login', (e: any) => {
				socketid = e.userid
				socket.emit('login', { userpic: userpic.src, username: username, socketid: socketid })

				// let useritem:string=`
				// `
				// $("#userlist").append(`<li data-id="${socketid}">${name}---${socketid}</li>`)
			})
			socket.on('userlist', (e: any) => {
				let useritem: string = ''
				for (let i in e.data) {
					let status = e.data[i].status
					let _pic = e.data[i].userpic
					let _username = e.data[i].username
					let _socketid = e.data[i].socketid
					if (status) {
						useritem +=
							`
						<li class="user-item online">
							<div class="pic">
								<img src="${_pic}" alt="">
							</div>
							<div class="name">${_username}</div>
							<div class="user-item-shade" data-id="${_socketid}" data-username="${_username}"></div>
						</li>
						`
					} else {
						useritem +=
							`
						<li class="user-item offline">
							<div class="pic">
								<img src="${_pic}" alt="">
							</div>
							<div class="name">${_username}</div>
							<div class="user-item-shade" data-id="${_socketid}" data-username="${_username}"></div>
						</li>
						`
					}
				}
				$(".user-list").empty()
				$(".user-list").append(useritem)
			})
			socket.on('message', (e: any) => {
				let messageitem: string = ''
				for (let i in e.data) {
					let tu = e.data[i].tu
					let _pic = e.data[i].userpic
					let _content = e.data[i].content
					if (tu) {
						messageitem +=
							`
						<div class="to">
							<div class="pic">
								<img src="${_pic}" alt="">
							</div>
							<div class="content">${_content}</div>
						</div>
						`
					} else {
						messageitem +=
							`
						<div class="from">
							<div class="pic">
								<img src="${_pic}" alt="">
							</div>
							<div class="content">${_content}</div>
						</div>
						`
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
				socket.emit('useritem', { to: _to_username, from: username })
			})
			$(".send").on("click", () => {
				let content = $(".editor").html()
				let msg = content.replace(/<div>/gm, ``).replace(/<\/div>/gm, `\n`).replace(/<br>/gm, ``)
				socket.emit('sendmsg', { msg: msg, socketid: socketid, to: _to_username, from: username })
				$(".editor").html('')
			})
		}
	})
});

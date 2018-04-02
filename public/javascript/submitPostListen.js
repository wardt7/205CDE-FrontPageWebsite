'use strict'

const READY = 4
const OK = 200

document.querySelector('#post').addEventListener('click', () => {
	console.log('button clicked')
	const xhr = new XMLHttpRequest()
	xhr.open('POST', '/addpost', true)
	const title = document.querySelector('input[name="title"]').value
	const content = document.querySelector('textarea[name="content"]').value
	const token = sessionStorage.getItem('token')
	const data = {'title': title, 'content': content}
	console.log(data)
	const stringData = JSON.stringify(data)
	console.log(stringData)
	console.log(title)
	console.log(content)
	console.log(token)
	xhr.setRequestHeader('Content-type', 'application/json')
	xhr.setRequestHeader('Authorization', `Basic ${token}`)
	xhr.send(stringData)

	xhr.onreadystatechange = () => {
		if (xhr.readyState === READY) {
			console.log(`status: ${xhr.status}`)
			if (xhr.status === OK) {
				console.log('Submit OK')
				//const data = JSON.parse(xhr.responseText)
				//console.log(data)
				window.location.replace('/')
			} else {
				console.log('Submit Bad')
			}
		}
	}
})

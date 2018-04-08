'use strict'

const READY = 4
const responseStatus = {
	OK: 200,
	NOT_AUTHORIZED: 401,
	INTERNAL_ERROR: 500
}


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
			if (xhr.status === responseStatus.OK) {
				console.log('Submit OK')
				//const data = JSON.parse(xhr.responseText)
				//console.log(data)
				window.location.replace('/')
			} else if (xhr.status === responseStatus.NOT_AUTHORIZED){
				console.log('Not logged in')
				document.getElementById('submitError').innerHTML = 'You must be logged in to submit posts'
			} else {
				console.log('Internal Error')
				document.getElementById('submitError').innerHTML = 'Internal Error (Did your title or content contain only whitespace?)'
			}
		}
	}
})

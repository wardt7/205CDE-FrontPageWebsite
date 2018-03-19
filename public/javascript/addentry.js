
'use strict'

console.log('fgdgjdfgj')

const status = {
	'OK': 200
}
const xmlStatus = {
	notInitialized: 0,
	connected: 1,
	received: 2,
	processing: 3,
	ready: 4
}

function getPosts(){
	console.log('starting getPosts')
	const xhr = new XMLHttpRequest()
	xhr.open('GET', `http://labs-wardt7590750.codeanyapp.com:8080/database/posts`, true)
	xhr.onload = () => {
		if (xhr.readyState === xmlStatus.ready) {
			if (xhr.status === status.OK) {
				console.log(xhr.responseText)
				const response = JSON.parse(xhr.responseText)
				console.log(response)
				const section = document.getElementById('entries')
				console.log(response['data'])
				for (const item of response['data']){
					console.log(item)
					const blog = document.createElement('article')
					const title = document.createElement('h1')
					const titleNode = document.createTextNode(`${item.title}`)
					title.appendChild(titleNode)
					const user = document.createElement('h4')
					const userNode = document.createTextNode(`${item.username}`)
					user.appendChild(userNode)
					const content = document.createElement('p')
					const contentNode = document.createTextNode(`${item.content}`)
					content.appendChild(contentNode)
					blog.appendChild(title)
					blog.appendChild(user)
					blog.appendChild(content)
					section.appendChild(blog)
					}
				}
			} else {
				console.error(xhr.statusText)
			}
		}
	xhr.onerror = () => {
		console.error(xhr.statusText)
	}
	xhr.send(null)
}
	
	

getPosts()




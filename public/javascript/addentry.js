
'use strict'

/**
* Client side code used generate the posts
* The code uses XMLHttpRequest to send an authorization request to the server
* @module addentry
* @requires XMLHttpRequest
*/

/**
* Object that defines the HTTP status codes we use
* @name status
* @type {object}
* @const
*/
const status = {
	'OK': 200
}

/**
* Function that uses XMLHTTPRequest to create the posts on the home page
* @function XMLHTTPRequest/addentry
* @param {string} requestType - GET
* @param {string} path - /adduser
* @param {boolean} async - We set the async property to true for time efficiency
* @returns {object} posts - We receive the posts from the database and insert them into the HTML.
*/
function getPosts(){
	console.log('starting getPosts')
	const xhr = new XMLHttpRequest()
	xhr.open('GET', '/database/posts', true)
	xhr.onload = () => {
		if (xhr.readyState === xhr.DONE) {
			if (xhr.status === status.OK) {
				console.log(xhr.responseText)
				const response = JSON.parse(xhr.responseText)
				console.log(response)
				const section = document.getElementById('entries')
				console.log(response['data'])
				for (const item of response['data']){
					console.log(item)
					const blog = document.createElement('article')
					const title = document.createElement('h2')
					const titleNode = document.createTextNode(`${item.title}`)
					title.appendChild(titleNode)
					const user = document.createElement('h4')
					const userNode = document.createTextNode(`Author: ${item.username}`)
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



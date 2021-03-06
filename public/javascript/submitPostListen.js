'use strict'

/**
* Client side code used to submit blog posts to the server
* The code uses XMLHttpRequest to send an addpost request to the server; if it rejects, then the client is updated.
* @module submitPostListen
* @requires XMLHttpRequest
*/

/**
* Object that defines the HTTP status codes we use
* @name responseStatus
* @type {object}
* @const
*/
const responseStatus = {
	OK: 200,
	NOT_AUTHORIZED: 401,
	INTERNAL_ERROR: 500
}

/**
* Listener that uses XMLHTTPRequest to add a user to the database, updating the page based upon the result
* @function listener/XMLHTTPRequest/addpost
* @param {string} id - the ID of the button we're assigning the listener to.
* @param {string} title - the title of the blog post
* @param {string} content - the content of the blog post
* @param {string} token - the user's authorization token
* @param {string} requestType - POST
* @param {string} path - /addpost
* @param {boolean} async - We set the async property to true for time efficiency
* @returns {object} status - We receive a status code, and redirect or update based on that code
*/
document.querySelector('#post').addEventListener('click', () => {
	console.log('button clicked')
	// Create a new request
	const xhr = new XMLHttpRequest()
	xhr.open('POST', '/addpost', true)
	// Fetch the data required
	const title = document.querySelector('input[name="title"]').value
	const content = document.querySelector('textarea[name="content"]').value
	const token = sessionStorage.getItem('token')
	const data = {'title': title, 'content': content}
	const stringData = JSON.stringify(data)
	// Send the request data
	xhr.setRequestHeader('Content-type', 'application/json')
	xhr.setRequestHeader('Authorization', `Basic ${token}`)
	xhr.send(stringData)

	xhr.onreadystatechange = () => {
		if (xhr.readyState === xhr.DONE) {
			// Update or redirect depending upon the status code
			console.log(`status: ${xhr.status}`)
			if (xhr.status === responseStatus.OK) {
				console.log('Submit OK')
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


'use strict'
/**
* Client side code used to redirect clients to the sign up page if they access the submit page without being logged in.
* The code uses XMLHttpRequest to send an authorization request to the server; if it rejects, then the client is redirected
* @module redirectorSubmit
* @requires XMLHttpRequest
*/
const NOT_AUTHORIZED = 401
const token = sessionStorage.getItem('token')

// Check to see if the token exists; if it doesn't, then immediately redirect
if(!sessionStorage.token) {
	location.replace('/create')
}

/**
* XMLHttpRequest that authorizes the user
* @function XMLHttpRequest/checkauth
* @param {string} requestType - GET
* @param {string} path - /checkauth
* @param {boolean} async - We set the async property to true for time efficiency
* @returns {object} status - We receive a status code, and redirect based upon that code
*/
const xhr = new XMLHttpRequest()
xhr.open('GET', '/checkauth', true)
xhr.setRequestHeader('authorization', `Basic ${token}`)
xhr.onreadystatechange = () => {
	if (xhr.readyState === xhr.DONE) {
		console.log(`status: ${xhr.status}`)
		if (xhr.status === NOT_AUTHORIZED) {
			location.replace('/create')
		}
	}
}

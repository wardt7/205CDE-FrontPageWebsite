'use strict'

/**
* Client side code used to submit credentials to the server when a user signs up, and also performs some client side validation
* The code uses XMLHttpRequest to send an adduser request to the server; if it rejects, then the client is updated.
* The client is also updated upon key presses
* @module signupListen
* @requires XMLHttpRequest
*/


const serverOK = 200
const MIN_LENGTH = 8

/**
* Listener that uses XMLHTTPRequest to add a user to the database, updating the page based upon the result
* @function listener/XMLHTTPRequest/signup
* @param {string} id - the ID of the button we're assigning the listener to.
* @param {string} user - the username to be added to the database
* @param {string} password - the password to be added to the database
* @param {string} validate - the string used to verify the password input
* @param {string} requestType - GET
* @param {string} path - /adduser
* @param {boolean} async - We set the async property to true for time efficiency
* @returns {object} status - We receive a status code, and redirect based upon that code
*/
document.querySelector('#signup').addEventListener('click', () => {
	console.log('button clicked')
	const xhr = new XMLHttpRequest()
	xhr.open('GET', '/adduser', true)
	// Get and generate the data required
	const user = window.document.querySelector('input[name="signupUsername"]').value
	const pass = window.document.querySelector('input[name="signupPassword"]').value
	const validate = window.document.querySelector('input[name="signupPasswordValidate"]').value
	const token = btoa(`${user}:${pass}:${validate}`)
	console.log(`token: ${token}`)
	xhr.setRequestHeader('Content-type', 'application/json')
	xhr.setRequestHeader('Authorization', `Basic ${token}`)
	xhr.send()

	xhr.onreadystatechange = () => {
		if (xhr.readyState === xhr.DONE) {
			console.log(`status: ${xhr.status}`)
			if (xhr.status === serverOK) {
				// If successfull, then assign the user the token in their session storage
				console.log('good credentials')
				const newtoken = btoa(`${user}:${pass}`)
				console.log(newtoken)
				sessionStorage.token = newtoken
				sessionStorage.setItem('token', newtoken)
				location.replace('/')
			} else {
				console.log('bad credentials')
				document.getElementById('signupError').innerHTML = 'Username already exists or a field contained only blank characters'
			}
		}
	}
})

/**
* Listener function that checks the password and validator to see if they fulfill some basic requirements
* @function listener/checkInput
* @param {string} password - the password to be added to the database
* @param {string} validate - the string used to verify the password input
* @returns {object} HTML - We update the HTML based on the result of the tests
*/
const checkInput = () => {
	const pass = document.querySelector('input[name="signupPassword"]').value
	const validate = document.querySelector('input[name="signupPasswordValidate"]').value
	if(pass.length < MIN_LENGTH){
		document.getElementById('password').style.backgroundColor = 'LightCoral'
		document.getElementById('signupError').innerHTML = 'Password must be longer than 7 characters'
		document.getElementById('signup').disabled = true
		return
	} else if (pass !== validate){
		document.getElementById('validator').style.backgroundColor = 'LightCoral'
		document.getElementById('signupError').innerHTML = 'Passwords Must Match'
		document.getElementById('signup').disabled = true
		return
	} else {
		document.getElementById('validator').style.backgroundColor = 'LightGreen'
		document.getElementById('password').style.backgroundColor = 'LightGreen'
		document.getElementById('signupError').innerHTML = ''
	}
	document.getElementById('signup').disabled = false
}

document.querySelector('#password').addEventListener('onkeyup', checkInput)
document.querySelector('#validator').addEventListener('onkeyup', checkInput)

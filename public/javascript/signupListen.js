'use strict'

const READY = 4
const OK = 200
const MIN_LENGTH = 8

document.querySelector('#signup').addEventListener('click', () => {
	console.log('button clicked')
	const xhr = new XMLHttpRequest()
	xhr.open('GET', '/adduser', true)
	const user = window.document.querySelector('input[name="signupUsername"]').value
	const pass = window.document.querySelector('input[name="signupPassword"]').value
	const validate = window.document.querySelector('input[name="signupPasswordValidate"]').value
	const token = btoa(`${user}:${pass}:${validate}`)
	console.log(`token: ${token}`)
	xhr.setRequestHeader('Content-type', 'application/json')
	xhr.setRequestHeader('Authorization', `Basic ${token}`)
	xhr.send()

	xhr.onreadystatechange = () => {
		if (xhr.readyState === READY) {
			console.log(`status: ${xhr.status}`)
			if (xhr.status === OK) {
				console.log('good credentials')
				//const data = JSON.parse(xhr.responseText)
				//console.log(data)
				const token = btoa(`${user}:${pass}`)
				console.log(token)
				sessionStorage.token = token
				sessionStorage.setItem('token', token)
				location.replace('/')
			} else {
				console.log('bad credentials')
				document.getElementById('signupError').innerHTML = 'Username already exists'
			}
		}
	}
})

const checkInput = () => {
	const pass = document.querySelector('input[name="signupPassword"]').value
	const validate = document.querySelector('input[name="signupPasswordValidate"]').value
	if(pass.length < MIN_LENGTH){
		document.getElementById('password').style.backgroundColor = 'LightCoral'
		document.getElementById('signupError').innerHTML = 'Password must be longer than 7 characters'
		document.getElementById('signup').disabled = true
	} else if (pass !== validate){
		document.getElementById('validator').style.backgroundColor = 'LightCoral'
		document.getElementById('signupError').innerHTML = 'Passwords Must Match'
		document.getElementById('signup').disabled = true
	} else {
		document.getElementById('validator').style.backgroundColor = 'LightGreen'
		document.getElementById('password').style.backgroundColor = 'LightGreen'
		document.getElementById('signupError').innerHTML = ''
		document.getElementById('signup').disabled = false
	}
}

document.querySelector('#password').addEventListener('onkeyup', checkInput)
document.querySelector('#validator').addEventListener('onkeyup', checkInput)

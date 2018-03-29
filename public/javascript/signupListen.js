'use strict'

const READY = 4
const OK = 200

window.document.querySelector('#signup').addEventListener('click', () => {
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
				window.location.replace('/')
			} else {
				console.log('bad credentials')
			}
		}
	}
})


const checkPass = () => {
	console.log('typing password')
	const pass = window.document.querySelector('input[name="signupPassword"]').value
	const validate = window.document.querySelector('input[name="signupPasswordValidate"]').value
	if(pass === validate){
		window.document.getElementById('validator').style.backgroundColor = 'green'
	} else {
		window.document.getElementById('validator').style.backgroundColor = 'red'
	}
}

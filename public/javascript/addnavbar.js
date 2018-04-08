
'use strict'


function getNav(){
	const READY = 4
	const OK = 200


	const token = sessionStorage.getItem('token')

	let loggedin = false

	if(!sessionStorage.token) {
		console.log('no token found')
	}

	const xhr = new XMLHttpRequest()
	xhr.open('GET', '/checkauth', true)
	xhr.setRequestHeader('authorization', `Basic ${token}`)
	xhr.onreadystatechange = () => {
		if (xhr.readyState === xhr.DONE) {
			console.log(`status: ${xhr.status}`)
			if (xhr.status === OK) {
				loggedin = true
			}
			const navbar = document.getElementById('navbar')
			const dropMenu = document.createElement('li')
			dropMenu.classList.add('dropmenu')
			dropMenu.setAttribute('style', 'float:right')
			const dropButton = document.createElement('a')
			dropButton.setAttribute('href','javascript:void(0)')
			dropButton.classList.add('dropbutton')
			const dropContent = document.createElement('div')
			dropContent.classList.add('dropcontent')
			dropContent.setAttribute('style', 'right:0')
			console.log(loggedin)
			if (!loggedin){
				const dropButtonText = document.createTextNode('Login')
				dropButton.appendChild(dropButtonText)
				dropMenu.appendChild(dropButton)
				const loginForm = document.createElement('form')
				loginForm.setAttribute('method', 'post')
				loginForm.setAttribute('action','/params')
				const usernameText = document.createElement('label')
				usernameText.innerHTML = 'Username:'
				loginForm.appendChild(usernameText)
				const usernameLineBreak = document.createElement('br')
				loginForm.appendChild(usernameLineBreak)
				const usernameInput = document.createElement('input')
				usernameInput.setAttribute('type','text')
				usernameInput.setAttribute('name','username')
				loginForm.appendChild(usernameInput)
				const usernameInputLineBreak = document.createElement('br')
				loginForm.appendChild(usernameInputLineBreak)
				const passwordText = document.createElement('label')
				passwordText.innerHTML = 'Password:'
				loginForm.appendChild(passwordText)
				const passwordLineBreak = document.createElement('br')
				loginForm.appendChild(passwordLineBreak)
				const passwordInput = document.createElement('input')
				passwordInput.setAttribute('type','password')
				passwordInput.setAttribute('name','password')
				loginForm.appendChild(passwordInput)
				const passwordInputLineBreak = document.createElement('br')
				loginForm.appendChild(passwordInputLineBreak)
				const submitLineBreak = document.createElement('br')
				loginForm.appendChild(submitLineBreak)
				const submitButton = document.createElement('input')
				submitButton.setAttribute('type','button')
				submitButton.setAttribute('value','Submit')
				submitButton.setAttribute('id','login')
				loginForm.appendChild(submitButton)
				const errMessage = document.createElement('p')
				errMessage.setAttribute('class','error')
				errMessage.setAttribute('id','loginError')
				errMessage.innerHTML = ''
				loginForm.appendChild(errMessage)
				dropContent.appendChild(loginForm)
				// const formLineBreak = window.document.createElement('br')
				// dropContent.appendChild(formLineBreak)
				const createAccount = document.createElement('a')
				createAccount.setAttribute('href','/create')
				const createAccountText = document.createTextNode('Create an Account')
				createAccount.appendChild(createAccountText)
				dropContent.appendChild(createAccount)
				dropMenu.appendChild(dropContent)
				navbar.appendChild(dropMenu)
				document.querySelector('#login').addEventListener('click', () => {
					console.log('button clicked')
					const xhr = new XMLHttpRequest()
					xhr.open('GET', '/checkauth', true)
					const user = window.document.querySelector('input[name="username"]').value
					const pass = window.document.querySelector('input[name="password"]').value
					const token = btoa(`${user}:${pass}`)
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
								document.getElementById('loginError').innerHTML = 'Error: Username/Password combination not found'
							}
						}
					}
				})
			} else {
				const decoded = atob(token)
				const username = decoded.split(':')[0]
				const dropButtonText = document.createTextNode(`${username}'s Account`)
				dropButton.appendChild(dropButtonText)
				dropMenu.appendChild(dropButton)
				const logOut = document.createElement('a')
				logOut.setAttribute('href','#')
				logOut.setAttribute('id','logout')
				const logOutText = document.createTextNode('Log Out')
				logOut.appendChild(logOutText)
				dropContent.appendChild(logOut)
				dropMenu.appendChild(dropContent)
				const submitPost = document.createElement('li')
				const submitPostLink = document.createElement('a')
				submitPostLink.setAttribute('href','/submit')
				const submitPostLinkText = document.createTextNode('Submit')
				submitPostLink.appendChild(submitPostLinkText)
				submitPost.appendChild(submitPostLink)
				navbar.appendChild(submitPost)
				navbar.appendChild(dropMenu)
				document.querySelector('#logout').addEventListener('click', () => {
					sessionStorage.removeItem('token')
					location.replace('/')
				})
			}
		}
	}
	xhr.send()
}

getNav()

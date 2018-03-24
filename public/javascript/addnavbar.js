'use strict'

function getNav(){
	const UNAUTHORIZED = 401

	const token = sessionStorage.getItem('token')

	let loggedin = false
	
	if(!sessionStorage.token) {
		console.log('no token found')
	}
	
	const xhr = new XMLHttpRequest()
	xhr.open('GET', '/checkauth', true)
	xhr.setRequestHeader('authorization', `basic: ${token}`)
	xhr.onreadystatechange = () => {
		if (xhr.readyState === xhr.DONE) {
			console.log(`status: ${xhr.status}`)
			if (xhr.status === UNAUTHORIZED) {
				console.log('unauthorised')
			} else loggedin = true
		}
	}
	xhr.send()
	
	const navbar = window.document.getElementById('navbar')
	const dropMenu = window.document.createElement('li')
	dropMenu.classList.add('dropmenu')
	dropMenu.setAttribute('style', 'float:right')
	const dropButton = window.document.createElement('a')
	dropButton.setAttribute('href','javascript:void(0)')
	dropButton.classList.add('dropbutton')
	const dropContent = window.document.createElement('div')
	dropContent.classList.add('dropcontent')
	dropContent.setAttribute('style', 'right:0')
	if (!loggedin){
		const dropButtonText = window.document.createTextNode('Login')
		dropButton.appendChild(dropButtonText)
		dropMenu.appendChild(dropButton)
		const loginForm = window.document.createElement('form')
		loginForm.setAttribute('method', 'post')
		loginForm.setAttribute('action','/params')
		const usernameText = window.document.createElement('label')
		usernameText.innerHTML = 'Username:'
		loginForm.appendChild(usernameText)
		const usernameLineBreak = window.document.createElement('br')
		loginForm.appendChild(usernameLineBreak)
		const usernameInput = window.document.createElement('input')
		usernameInput.setAttribute('type','text')
		usernameInput.setAttribute('name','username')
		loginForm.appendChild(usernameInput)
		const usernameInputLineBreak = window.document.createElement('br')
		loginForm.appendChild(usernameInputLineBreak)
		const passwordText = window.document.createElement('label')
		passwordText.innerHTML = 'Password:'
		loginForm.appendChild(passwordText)
		const passwordLineBreak = window.document.createElement('br')
		loginForm.appendChild(passwordLineBreak)
		const passwordInput = window.document.createElement('input')
		passwordInput.setAttribute('type','password')
		passwordInput.setAttribute('name','password')
		loginForm.appendChild(passwordInput)
		const passwordInputLineBreak = window.document.createElement('br')
		loginForm.appendChild(passwordInputLineBreak)
		const submitLineBreak = window.document.createElement('br')
		loginForm.appendChild(submitLineBreak)
		const submitButton = window.document.createElement('input')
		submitButton.setAttribute('type','button')
		submitButton.setAttribute('value','Submit')
		loginForm.appendChild(submitButton)
		dropContent.appendChild(loginForm)
		// const formLineBreak = window.document.createElement('br')
		// dropContent.appendChild(formLineBreak)
		const createAccount = window.document.createElement('a')
		createAccount.setAttribute('href','/create')
		const createAccountText = window.document.createTextNode('Create an Account')
		createAccount.appendChild(createAccountText)
		dropContent.appendChild(createAccount)
		dropMenu.appendChild(dropContent)
		navbar.appendChild(dropMenu)
	} else {
		const decoded = Buffer.from(token, 'base64').toString()
		const dropButtonText = window.document.createTextNode(`${data}`)
		dropButton.appendChild(dropButtonText)
		dropMenu.appendChild(dropButton)
		const logOut = window.document.createElement('a')
		logOut.setAttribute('href','/')
		const logOutText = window.document.createTextNode('Log Out')
		logOut.appendChild(logOutText)
		dropContent.appendChild(logOut)
		dropMenu.appendChild(dropContent)
		navbar.appendChild(dropMenu)
	}
}

getNav()

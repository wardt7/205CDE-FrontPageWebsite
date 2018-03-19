'use strict'

function getNav(){
  let data = ''
  console.log('running getNav')
  const cookieSearch = 'username='
  const userCookie = decodeURIComponent(document.cookie).split(";")
  for(let i=0; i < userCookie.length; i++){
    let current = userCookie[i]
    while (current.charAt(0) === [' ']){
      current = current.substring(1)
    }
    if (current.indexOf(cookieSearch)){
      data = current.substring(cookieSearch.length,current.length)
      break
    }
  }
  // data = 'Alice'
  console.log('Done finding cookies')
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
  if (data === ''){
    const dropButtonText = document.createTextNode('Login')
    dropButton.appendChild(dropButtonText)
    dropMenu.appendChild(dropButton)
    const loginForm = document.createElement('form')
    loginForm.setAttribute('method', 'post')
    loginForm.setAttribute('action','/params')
    const usernameText = document.createElement('label')
    usernameText.innerHTML = "Username:"
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
    passwordText.innerHTML = "Password:"
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
    submitButton.setAttribute('type','submit')
    submitButton.setAttribute('value','Submit')
    loginForm.appendChild(submitButton)
    dropContent.appendChild(loginForm)
    dropMenu.appendChild(dropContent)
    navbar.appendChild(dropMenu)
  } else {
    console.log('found cookie')
    const dropButtonText = document.createTextNode(`${data}`)
    dropButton.appendChild(dropButtonText)
    dropMenu.appendChild(dropButton)
    const logOut = document.createElement('a')
    logOut.setAttribute('href','/')
    const logOutText = document.createTextNode('Log Out')
    logOut.appendChild(logOutText)
    dropContent.appendChild(logOut)
    dropMenu.appendChild(dropContent)
    navbar.appendChild(dropMenu)
  }
}

getNav()
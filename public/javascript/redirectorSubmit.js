
'use strict'

const NOT_AUTHORIZED = 401
const token = sessionStorage.getItem('token')

if(!sessionStorage.token) {
	location.replace('/create')
}

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

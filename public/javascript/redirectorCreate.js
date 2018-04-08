
'use strict'

const OK = 401
function main() {
	const token = sessionStorage.getItem('token')
	if(!sessionStorage.token) {
		return
	}
	const xhr = new XMLHttpRequest()
	xhr.open('GET', '/checkauth', true)
	xhr.setRequestHeader('authorization', `Basic ${token}`)
	xhr.onreadystatechange = () => {
		if (xhr.readyState === xhr.DONE) {
			console.log(`status: ${xhr.status}`)
			if (xhr.status === OK) {
				location.replace('/')
			}
		}
	}
}
main()



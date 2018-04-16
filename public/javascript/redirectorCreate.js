
'use strict'

/**
* Client side code used to redirect clients to the home page if they try to sign up again whilst logged in
* @module redirectorCreate
*/

if(sessionStorage.token) {
	location.replace('/')
}



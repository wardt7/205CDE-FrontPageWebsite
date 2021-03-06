
'use strict'

/**
* The main server file that is ran to start the website
* @module index
* @requires express
* @requires express-es6-template-engine
* @requires body-parser
* @requires databaseHandling
*/

const express = require('express')
const es6Renderer = require('express-es6-template-engine')
const bodyParser = require('body-parser')
const databaseHandling = require('./databaseHandling.js')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static('public'))

app.engine('html', es6Renderer)
app.set('views', 'html')
app.set('view engine', 'html')

const port = 8080

/**
* Object that defines the HTTP status codes we use
* @name status
* @type {object}
* @const
*/
const status = {
	OK: 200,
	NO_CONTENT: 204,
	NOT_AUTHORIZED: 401,
	NOT_FOUND: 404,
	INTERNAL_ERROR: 500
}

/**
* Route serving the home page
* @function get/
* @param {string} path
* @param {function} callback - contains the request data from the user and the response we want to send back
* @returns {object} html - The code send the HTML document
*/
app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/html/index.html`)
})

/**
* Route used by client side JavaScript that checks if a user is authorized for features/pages (e.g. to write blog posts)
* @function get/checkauth
* @param {string} path
* @param {function} callback - contains the request data from the user and the response we want to send back
* @returns {object} status - The status code to send back to inform the client whether or not the user is authorized
*/
app.get('/checkauth', (req, res) => {
	res.setHeader('Content-Type', 'application/json')
	// First check the header to see if it exists and is formatted correctly
	if(!req.headers.authorization){
		console.log('no header')
		res.status(status.NOT_AUTHORIZED).end()
	}
	if(req.headers.authorization.indexOf('Basic ') !== 0){
		console.log('no basic')
		res.status(status.NOT_AUTHORIZED).end()
	}
	// Decode the header into its constituents
	const [,token] = req.headers.authorization.split(' ')
	const decoded = Buffer.from(token, 'base64').toString()
	const [username, password] = decoded.split(':')
	// Run the authorization code to see if the user is authorized
	databaseHandling.authorize(username, password, (err) => {
		if (err){
			console.log(err)
			res.status(status.NOT_AUTHORIZED).end()
		} else {
			res.status(status.OK).end()
		}
	})
})

/**
* Route used by client side JavaScript that adds a user to the database of users
* @function get/adduser
* @param {string} path
* @param {function} callback - contains the request data from the user and the response we want to send back
* @returns {object} status - The status code to send back to inform the client whether or not the user is authorized
*/
app.get('/adduser', (req, res) => {
	res.setHeader('Content-Type', 'application/json')
	// Check to see if the header exists and is formatted correctly
	if(!req.headers.authorization) res.status(status.NOT_AUTHORIZED).end()
	if(req.headers.authorization.indexOf('Basic ') !== 0) res.status(status.NOT_AUTHORIZED).end()
	// Decode the header into its constituents
	const [,token] = req.headers.authorization.split(' ')
	const decoded = Buffer.from(token, 'base64').toString()
	const [username, password, validate] = decoded.split(':')
	// Check if both supplied passwords match
	if(password !== validate){
		console.log('validator and password don\'t matchy matchy')
		console.log(password)
		console.log(validate)
		res.status(status.INTERNAL_ERROR).end()
	}
	// Check if one of the submitted items is empty or just whitespace
	if (/\S/.test(username) && /\S/.test(password) && /\S/.test(password)) {
		console.log(/\S/.test(username))
		console.log(/\S/.test(password))
		databaseHandling.addUser(username, password, (err) => {
			if (err){
				res.status(status.INTERNAL_ERROR).end()
			} else {
				res.status(status.OK).end()
			}
		})
	} else res.status(status.INTERNAL_ERROR).end()
})

/**
* Route used by client side JavaScript that adds a post to the database of posts
* @function get/addpost
* @param {string} path
* @param {function} callback - contains the request data from the user and the response we want to send back
* @returns {object} status - The status code to send back to inform the client whether or not the user is authorized
*/
app.post('/addpost', (req, res) => {
	res.setHeader('Content-Type', 'application/json')
	// Check to see if the headers for authorization exist and are formatted correctly
	if(!req.headers.authorization) res.status(status.NOT_AUTHORIZED).end()
	if(req.headers.authorization.indexOf('Basic ') !== 0) res.status(status.NOT_AUTHORIZED).end()
	// Decode the header
	const [,token] = req.headers.authorization.split(' ')
	const decoded = Buffer.from(token, 'base64').toString()
	const [username, password] = decoded.split(':')
	// We must first authorize the user before they can post, as only users can post
	databaseHandling.authorize(username, password, (err) => {
		if (err){
			console.log(err)
			res.status(status.NOT_AUTHORIZED).end()
		} else {
			// Check to see that the title and content aren't empty or whitespace
			if (/\S/.test(req.body.title) && /\S/.test(req.body.content)) {
				// Add the post to the database of posts
				databaseHandling.addPost(username, req.body.title, req.body.content, (err) => {
					if (err){
						console.log(err)
						res.status(status.INTERNAL_ERROR).end()
					} else res.status(status.OK).end()
				})
			} else {
				res.status(status.INTERNAL_ERROR).end()
			}
		}
	})
})

/**
* Route serving the sign up page
* @function get/create
* @param {string} path
* @param {function} callback - contains the request data from the user and the response we want to send back
* @returns {object} html - The code send the HTML document
*/
app.get('/create', (req, res) => {
	res.sendFile(`${__dirname}/html/signup.html`)
})

/**
* Route serving the blog submission page
* @function get/submit
* @param {string} path
* @param {function} callback - contains the request data from the user and the response we want to send back
* @returns {object} html - The code send the HTML document
*/
app.get('/submit', (req, res) => {
	res.sendFile(`${__dirname}/html/submit.html`)
})

/**
* Route serving the blog posts from the database as a JSON object
* @function get/database/posts
* @param {string} path
* @param {function} callback - contains the request data from the user and the response we want to send back
* @returns {object} data - The JSON object we send back
*/
app.get('/database/posts', (req, res) => {
	res.setHeader('content-type','application/json')
	databaseHandling.sendPosts((err, data) => {
		if (err) {
			res.status(status.NO_CONTENT)
			res.send(err.message)
		} else {
			res.status(status.OK)
			res.send(data)
		}
	})
})

app.get('/out/index.html', (req, res) => {
	res.sendFile(`${__dirname}/out/index.html`)
})

app.get('/out/index.js.html', (req, res) => {
	res.sendFile(`${__dirname}/out/index.js.html`)
})

app.get('/out/databaseHandling.js.html', (req, res) => {
	res.sendFile(`${__dirname}/out/databaseHandling.js.html`)
})

app.get('/out/module-index.html', (req, res) => {
	res.sendFile(`${__dirname}/out/module-index.html`)
})

app.get('/out/module-databaseHandling.html', (req, res) => {
	res.sendFile(`${__dirname}/out/module-databaseHandling.html`)
})

app.get('/public/javascript/out/index.html', (req, res) => {
	res.sendFile(`${__dirname}/public/javascript/out/index.html`)
})

app.get('/public/javascript/out/addentry.js.html', (req, res) => {
	res.sendFile(`${__dirname}/public/javascript/out/addentry.js.html`)
})

app.get('/public/javascript/out/module-addentry.html', (req, res) => {
	res.sendFile(`${__dirname}/public/javascript/out/module-addentry.html`)
})

app.get('/public/javascript/out/addnavbar.js.html', (req, res) => {
	res.sendFile(`${__dirname}/public/javascript/out/addnavbar.js.html`)
})

app.get('/public/javascript/out/module-addnavbar.html', (req, res) => {
	res.sendFile(`${__dirname}/public/javascript/out/module-addnavbar.html`)
})

app.get('/public/javascript/out/redirectorCreate.js.html', (req, res) => {
	res.sendFile(`${__dirname}/public/javascript/out/redirectorCreate.js.html`)
})

app.get('/public/javascript/out/module-redirectorCreate.html', (req, res) => {
	res.sendFile(`${__dirname}/public/javascript/out/module-redirectorCreate.html`)
})

app.get('/public/javascript/out/redirectorSubmit.js.html', (req, res) => {
	res.sendFile(`${__dirname}/public/javascript/out/redirectorSubmit.js.html`)
})

app.get('/public/javascript/out/module-redirectorSubmit.html', (req, res) => {
	res.sendFile(`${__dirname}/public/javascript/out/module-redirectorSubmit.html`)
})

app.get('/public/javascript/out/signupListen.js.html', (req, res) => {
	res.sendFile(`${__dirname}/public/javascript/out/signupListen.js.html`)
})

app.get('/public/javascript/out/module-signupListen.html', (req, res) => {
	res.sendFile(`${__dirname}/public/javascript/out/module-signupListen.html`)
})

app.get('/public/javascript/out/submitPostListen.js.html', (req, res) => {
	res.sendFile(`${__dirname}/public/javascript/out/submitPostListen.js.html`)
})

app.get('/public/javascript/out/module-submitPostListen.html', (req, res) => {
	res.sendFile(`${__dirname}/public/javascript/out/module-submitPostListen.html`)
})

/**
* Route that serves an error 404 if the page isn't found
* @function get/*
* @param {string} path
* @param {function} callback - contains the request data from the user and the response we want to send back
* @returns {object} html - The code send the HTML document
*/
app.get('*', (req, res) => {
	res.status(status.NOT_FOUND)
	res.sendFile(`${__dirname}/html/404.html`)
})

/**
* Middleware route; this could be used in the future for if a route throws an error
* @function use
* @param {function} callback - contains the request data from the user and the response we want to send back
* @returns {object} JSON - A JSON object that contains the error
*/
app.use((err, req, res) => {
	// Middleware error handling function that could be used for future routing
	res.status(err.status || status.INTERNAL_ERROR)
	res.render('error',{
		message: err.message,
		error: {}
	})
})


app.listen(port, () => {
	console.log(`app listening on port ${port}`)
})

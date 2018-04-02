
'use strict'

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

const status = {
	OK: 200,
	NOT_AUTHORISED: 401,
	NOT_FOUND: 404,
	INTERNAL_ERROR: 500
}

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/html/index.html`)
})

app.get('/checkauth', (req, res) => {
	if(!req.headers.authorization){
		console.log('no header')
		res.status(status.NOT_AUTHORISED).end()
	}
	if(req.headers.authorization.indexOf('Basic ') !== 0){
		console.log('no basic')
		res.status(status.NOT_AUTHORISED).end()
	}
	const [,token] = req.headers.authorization.split(' ') // destructuring assignment
	const decoded = Buffer.from(token, 'base64').toString()
	const [username, password] = decoded.split(':')
	databaseHandling.authorize(username, password, (err) => {
		if (err){
			console.log(err)
			res.status(status.NOT_AUTHORISED).end()
		} else res.status(status.OK).end()
	})
})

app.get('/adduser', (req, res) => {
	if(!req.headers.authorization) res.status(status.NOT_AUTHORISED).end()
	if(req.headers.authorization.indexOf('Basic ') !== 0) res.status(status.NOT_AUTHORISED).end()
	const [,token] = req.headers.authorization.split(' ') // destructuring assignment
	const decoded = Buffer.from(token, 'base64').toString()
	const [username, password, validate] = decoded.split(':')
	if(password !== validate){
		console.log('validator and password don\'t matchy matchy')
		console.log(password)
		console.log(validate)
		res.status(status.NOT_AUTHORISED).end()
	}
	databaseHandling.addUser(username, password, (err) => {
		if (err){
			res.status(status.NOT_AUTHORISED).end()
		} else res.status(status.OK).end()
	})
})

app.post('/addpost', (req, res) => {
	if(!req.headers.authorization) res.status(status.NOT_AUTHORISED).end()
	if(req.headers.authorization.indexOf('Basic ') !== 0) res.status(status.NOT_AUTHORISED).end()
	const [,token] = req.headers.authorization.split(' ') // destructuring assignment
	const decoded = Buffer.from(token, 'base64').toString()
	const [username, password] = decoded.split(':')
	databaseHandling.authorize(username, password, (err) => {
		if (err){
			console.log(err)
			res.status(status.NOT_AUTHORISED).end()
		} else {
			console.log('authorized')
			databaseHandling.addPost(username, req.body.title, req.body.content, (err) => {
				if (err){
					console.log(err)
					res.status(status.NOT_AUTHORISED).end()
				} else res.status(status.OK).end()
			})
		}
	})
})

app.get('/create', (req, res) => {
	res.sendFile(`${__dirname}/html/signup.html`)
})

app.get('/submit', (req, res) => {
	res.sendFile(`${__dirname}/html/submit.html`)
})

app.get('/database/posts', (req, res) => {
	res.setHeader('content-type','application/json')
	databaseHandling.sendPosts((err, data) => {
		if (err) {
			res.status(status.NOT_FOUND)
			res.send(err.message)
		} else {
			res.status(status.OK)
			res.send(data)
		}
	})
})

app.get('*', (req, res) => {
	res.status(status.NOT_FOUND)
	res.sendFile(`${__dirname}/html/404.html`)
})

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

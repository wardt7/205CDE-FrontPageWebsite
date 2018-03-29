
'use strict'

const express = require('express')
const es6Renderer = require('express-es6-template-engine')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
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
	NOT_FOUND: 404
}

const JSONString = toSend => new Promise( (resolve, reject) => {
	const string = JSON.stringify(toSend)
	if (string === undefined) reject(new Error('Couldn\'t stringify object'))
	resolve(string)
})

const openDB = () => new Promise( (resolve, reject) => {
	const db = new sqlite3.Database('./db/websiteData.db', (err) => {
		if (err){
			console.log(err.message)
			reject(new Error(err.message))
		}
		db.serialize( () => {
			db.run('CREATE TABLE IF NOT EXISTS users(username TEXT PRIMARY KEY, password TEXT NOT NULL)'), (err) => {
				if (err){
					console.log(err.message)
					reject(new Error(err.message))
				}
			}
			db.run(`CREATE TABLE IF NOT EXISTS posts(postID INTEGER PRIMARY KEY AUTOINCREMENT, 
							timestamp INTEGER NOT NULL, title TEXT NOT NULL, username TEXT NOT NULL,
							content TEXT NOT NULL,
							FOREIGN KEY(username) REFERENCES users(username))`, (err) => {
				if (err){
					console.log(err.message)
					reject(new Error(err.message))
				} else {
					resolve(db)
				}
			})
		})
	})
})

const closeDB = db => new Promise( (resolve, reject) => {
	db.close((err) => {
		if (err){
			console.log(err.message)
			reject(new Error(err.message))
		} else resolve()
	})
})

const getPosts = db => new Promise( (resolve, reject) => {
	const sql = 'SELECT * FROM posts ORDER BY timestamp DESC'
	db.all(sql, [], (err, rows) => {
		if (err){
			console.log(err.message)
			reject(new Error(err.message))
		} else {
			const sqlData = []
			rows.forEach((row) => {
				sqlData.push(row)
			})
			resolve({data: sqlData})
		}
	})
})

const newUser = (db, username, password) => new Promise( (resolve, reject) => {
	db.run('INSERT INTO users VALUES (?,?)', [username, password], (err) => {
		if(err){
			console.log(err.message)
			reject(err)
		} else resolve('Inserted')
	})
})

const newPost = (db, title, username, content) => new Promise( (resolve, reject) => {
	const timestamp = Date.now((err) => {
		if(err){
			console.log(err.message)
			reject(err)
		}
	})
	db.run('INSERT INTO posts(timestamp, title, username, content) VALUES (?,?,?,?)', [timestamp, title, username, content], (err) => {
		if(err){
			console.log(err.message)
			reject(err)
		} else resolve('inserted post')
	})
})

const findUser = (db, username, password) => new Promise( (resolve, reject) => {
	db.get('SELECT * FROM USERS WHERE username = ? AND password = ?', [username,password], (err, row) => {
		if(err){
			console.log(err.message)
			reject(err)
		} else{
			if (row === undefined){
				reject('User/Password combination not found')
			} else resolve('Authorized')
		}
	})
})


async function sendPosts(callback) {
	try {
		const connection = await openDB()
		const data = await getPosts(connection)
		await closeDB(connection)
		const toReturn = await JSONString(data)
		callback(null, toReturn)
	} catch (err) {
		callback(err)
	}
}

async function authorize(username, password, callback){
	try{
		const connection = await openDB()
		const authorize = await findUser(connection, username, password)
		await closeDB(connection)
		console.log('User OK')
		callback(null)
	} catch (err) {
		callback(err)
	}
}

async function addUser(username, password, callback){
	try{
		const connection = await openDB()
		await newUser(connection, username, password)
		await closeDB(connection)
		callback(null)
	} catch (err) {
		callback(err)
	}
}

async function addPost(username, title, content, callback){
	try{
		const connection = await openDB()
		await newPost(connection, title, username, content)
		await closeDB(connection)
		callback(null)
	} catch (err) {
		callback(err)
	}
}

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/html/index.html`)
})

app.get('/checkauth', (req, res) => {
	if(!req.headers.authorization){
		console.log("no header")
		res.status(status.NOT_AUTHORISED).end()
	} 
	if(req.headers.authorization.indexOf('Basic ') !== 0){
		console.log("no basic")
		res.status(status.NOT_AUTHORISED).end()
	} 
	const [,token] = req.headers.authorization.split(' ') // destructuring assignment
	const decoded = Buffer.from(token, 'base64').toString()
	const [username, password, validate] = decoded.split(':')
	if(password !== validate){
		console.log("validator and password don't matchy matchy")
		res.status(status.NOT_AUTHORISED).end()
	}
	authorize(username, password, (err) => {
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
	const [username, password] = decoded.split(':')
	addUser(username, password, (err) => {
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
	authorize(username, password, (err) => {
		if (err){
			console.log(err)
			res.status(status.NOT_AUTHORISED).end()
		} else {
			console.log('authorized')
			addPost(username, req.body.title, req.body.content, (err) => {
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
	sendPosts((err, data) => {
		if (err) {
			res.status(status.NOT_FOUND)
			res.send(err.message)
		} else {
			res.status(status.OK)
			res.send(data)
		}
	})
})

app.listen(port, () => {
	console.log(`app listening on port ${port}`)
})

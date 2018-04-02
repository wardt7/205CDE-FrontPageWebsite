
'use strict'

const sqlite3 = require('sqlite3').verbose()

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
		await findUser(connection, username, password)
		await closeDB(connection)
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

module.exports.sendPosts = sendPosts
module.exports.authorize = authorize
module.exports.addUser = addUser
module.exports.addPost = addPost

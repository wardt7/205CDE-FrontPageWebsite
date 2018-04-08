
'use strict'

/**
* A module that handles interaction with the database, as well as authorizing users, etc
* @module databaseHandling
*/


const sqlite3 = require('sqlite3').verbose()


/**
* Convert a JSON Object to a string
* @function JSONString
* @param {JSON} toSend - The JSON data to be converted to a string
* @returns {Promise<string>|Promise<Error>} string - The converted JSON data
*/
const JSONString = toSend => new Promise( (resolve, reject) => {
	const string = JSON.stringify(toSend)
	if (string === undefined) reject(new Error('Couldn\'t stringify object'))
	resolve(string)
})

/**
* Open a connection to the database, and if necessary creates the required tables
* @function openDB
* @requires sqlite3
* @returns {Promise<object>|Promise<Error>} db - A promise containing the database connection, or an error message if unsuccessful
*/
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

/**
* Closes a connection to the database
* @function closeDB
* @requires sqlite3
* @param {Object} db - The database connection
* @returns {Promise.<null>|Promise.<Error>} db - A promise containing a null, or a promise with an error if an error occurs
*/
const closeDB = db => new Promise( (resolve, reject) => {
	db.close((err) => {
		if (err){
			console.log(err.message)
			reject(new Error(err.message))
		} else resolve()
	})
})

/**
* Obtains all the posts held within the database
* @function openDB
* @requires sqlite3
* @param {Object} db - The database connection
* @returns {Promise<JSON>|Promise<Error>} db - A promise containing a JSON object with data or an error if unsuccessful
*/
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

/**
* Inserts a new user into the database
* @function newUser
* @requires sqlite3
* @param {Object} db - The database connection
* @param {string} username - The username of the user to be inserted
* @param {string} password - The password of the user to be inserted
* @returns {Promise<null>|Promise<Error>} db - A promise containing a null if successful or an error if unsuccessful
*/
const newUser = (db, username, password) => new Promise( (resolve, reject) => {
	db.run('INSERT INTO users VALUES (?,?)', [username, password], (err) => {
		if(err){
			console.log(err.message)
			reject(err)
		} else resolve()
	})
})

/**
* Inserts a new post into the database
* @function newPost
* @requires sqlite3
* @param {Object} db - The database connection
* @param {string} title - The title of the blog post
* @param {string} username - The username of the post author
* @param {string} content - The content of the blog post
* @returns {Promise<null>|Promise<Error>} db - A promise containing a null if successful or an error if unsuccessful
*/
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
		} else resolve()
	})
})

/**
* Attempts to find a user in the database
* @function findUser
* @requires sqlite3
* @param {Object} db - The database connection
* @param {string} username - The username of the user to be found
* @param {string} password - The password of the user to be found
* @returns {Promise<null>|Promise<Error>|Promise<string>} db - A promise containing a null if successful; an error object if an error occurs; or a rejected string if the user wasn't found
*/
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

/**
* Opens a database and returns the data found in a callback
* @async
* @function sendPosts
* @requires sqlite3
* @param {Function} callback
* @returns {JSON<Array>|Error} - Returns the JSON object obtained or an error
*/
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

/**
* Opens a database and finds a user to authorize them
* @async
* @function sendPosts
* @requires sqlite3
* @param {string} username - The username of the user to authorize
* @param {string} password - The password of the user to authorize
* @param {Function} callback
* @returns {null|Error} - Returns the JSON object obtained or an error
*/
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

/**
* Opens a database and inserts a new user
* @async
* @function sendPosts
* @requires sqlite3
* @param {string} username - The username of the user to authorize
* @param {string} password - The password of the user to authorize
* @param {Function} callback
* @returns {null|Error} - Returns the JSON object obtained or an error
*/
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

/**
* Opens a database and returns the data found in a callback
* @async
* @function sendPosts
* @requires sqlite3
* @param {string} username - The username of the post author
* @param {string} title - The title of the post
* @param {string} content - The content of the post
* @param {Function} callback
* @returns {null|Error} - Returns the JSON object obtained or an error
*/
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

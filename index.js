
'use strict'

const express = require('express')
const es6Renderer = require('express-es6-template-engine')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const app = express()
app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static('public'))

app.engine('html', es6Renderer)
app.set('views', 'html')
app.set('view engine', 'html')

const port = 8080

const JSONString = toSend => new Promise( (resolve, reject) => {
	const string = JSON.stringify(toSend)
	if (string === undefined) reject(new Error('Couldn\'t stringify object'))
	resolve(string)
})

const getBlogs = () => new Promise( (resolve, reject) => {
	let db = new sqlite3.Database('./db/websiteData.db', (err) => {
		if (err){
			reject(err)
		} else {
			console.log('Connected to websiteData.db')
		}
	})
	const sql = 'SELECT title, username, content FROM Blogs ORDER BY timestamp DESC'
	let sqlData = []
	db.all(sql, [], (err, rows) => {
		if (err){
			reject(err)
		} else {
			rows.forEach((row) => {
				toReturn.push(row)
			})
		}
	})
	db.close((err) => {
		if (err){
			reject(err)
		} else {
			console.log('Disconnected from websiteData.db')
		}
	})
	const toReturn = {data: sqlData}
	resolve(toReturn)
})

async function sendData(data, callback) {
	try {
		await getBlogs()
		const toReturn = await JSONString(data)
		callback(null, toReturn)
	} catch (err) {
		callback(err)
	}
}

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/html/index.html`)
})

app.get('/account', (req, res) => {
	res.sendFile(`${__dirname}/html/signup.html`)
})

app.post('/params', (req, res) => {
	const data = req.body
	res.write('<html><body><h2>Retrieving Data in Body</h2><table>')
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			console.log(key)
			console.log(data[key])
			res.write(`<tr><td>${key}</td><td>${data[key]}</td></tr>`)
		}
	}
	res.write('</table></body></html>')
	res.end()
})

app.get('/database/posts', (req, res) => {
	const items = {data: [{title: 'Hello World',
								 				username: 'Alice',
								 				content: 'Lorem ipsum dolor sit amet'},
	{title: 'Goodbye World',
          							username: 'Bob',
          							content: 'Some other sad stuff'}]}
	res.setHeader('content-type','application/json')
	sendData(items, (err, data) => {
		res.setHeader('content-type','application/json')
		if (err) {
			res.send(err.message)
		} else {
			res.send(data)
		}
	})
})

app.listen(port, () => {
	console.log(`app listening on port ${port}`)
})

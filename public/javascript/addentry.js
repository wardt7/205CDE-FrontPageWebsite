
'use strict'

console.log('fgdgjdfgj')

const data = {
	id_one: {title: 'Hello World',
		username: 'Alice',
		content: 'Lorem ipsum dolor sit amet'
	},
	id_two: {title: 'Goodbye World',
		username: 'Bob',
		content: 'Some other sad stuff'}
}

const section = document.getElementById('entries')
console.log(section)
for (const item in data) {
	console.log('loop')
	const blog = document.createElement('article')
	const title = document.createElement('h1')
	const titleNode = document.createTextNode(`${data[item].title}`)
	title.appendChild(titleNode)
	const user = document.createElement('h4')
	const userNode = document.createTextNode(`${data[item].username}`)
	user.appendChild(userNode)
	const content = document.createElement('p')
	const contentNode = document.createTextNode(`${data[item].content}`)
	content.appendChild(contentNode)
	blog.appendChild(title)
	blog.appendChild(user)
	blog.appendChild(content)
	section.appendChild(blog)
}

const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')

app.use(morgan((tokens, req, res) => {
  const base = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')

  const body = tokens.body(req, res)
  return body ? `${base} ${body}` : base
}))

let phoneBook = {
    "persons": [
        {
            "name": "Mary Poppendieck",
            "number": "39-23-6423122",
            "id": "0"
        },
        {
            "name": "John Doe",
            "number": "12-34-5678901",
            "id": "1"
        },
        {
            "name": "Jane Smith",
            "number": "98-76-5432109",
            "id": "2"
        },
        {
            "name": "Ada Lovelace",
            "number": "22-33-4455667",
            "id": "3"
        },
        {
            "name": "Alan Turing",
            "number": "11-22-3344556",
            "id": "4"
        },
        {
            "name": "Grace Hopper",
            "number": "77-88-9900112",
            "id": "5"
        },
        {
            "name": "Linus Torvalds",
            "number": "66-55-4433221",
            "id": "6"
        },
        {
            "name": "Margaret Hamilton",
            "number": "44-33-2211009",
            "id": "7"
        },
        {
            "name": "Tim Berners-Lee",
            "number": "88-77-6655443",
            "id": "8"
        },
        {
            "name": "Barbara Liskov",
            "number": "55-44-3322110",
            "id": "9"
        }
    ]
  }


app.get('/api/persons', (request, response) => {
    response.json(phoneBook.persons)
  })
  
app.get('/info', (request, response) => {
    const currenDate = new Date()
    const info = 
        `<div>Phonebook has info for ${phoneBook.persons.length} people</div>
        <div>${currenDate}</div>`
    response.send(info)
  })

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phoneBook.persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phoneBook.persons.find(p => p.id === id)
    if (person) {
        phoneBook.persons = phoneBook.persons.filter(p => p.id !== id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    return Math.floor(Math.random() * 99999).toString()
}

app.post('/api/persons', (request, response) => {
    const data = request.body

    if (!data.name || !data.number) {
        return response.status(400).json({ error: 'name or number is missing' })
    }

    if (phoneBook.persons.find(p => p.name === data.name)) {
        return response.status(400).json({ error: 'name must be unique' })
    }
    
    const newPerson = {
        name: data.name,
        number: data.number,
        id: generateId()
    }

    phoneBook.persons = phoneBook.persons.concat(newPerson)
    response.status(200).json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
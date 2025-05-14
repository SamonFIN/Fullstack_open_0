require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./modules/person')

const app = express()
app.use(express.json())
app.use(express.static('dist'))


// formatting the log output
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


// Method to get all persons
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})


// Method to get the total number of persons and the current date
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const currentDate = new Date()
      const info =
            `<div>Phonebook has info for ${count} people</div>
            <div>${currentDate}</div>`
      response.send(info)
    })
    .catch(error => next(error))
})


// Method to get a person by ID
app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


// Method to delete a person by ID
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => next(error))
})


// Method to add a new person
app.post('/api/persons', (request, response, next) => {
  const data = request.body

  if (!data.name || !data.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  Person.findOne({ name: data.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({ error: 'name must be unique' })
      }

      const newPerson = new Person({
        name: data.name,
        number: data.number
      })

      return newPerson.save()
        .then(savedPerson => {
          response.status(201).json(savedPerson)
        })
    })
    .catch(error => next(error))
})


// Method to update a person's information
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.name, error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)
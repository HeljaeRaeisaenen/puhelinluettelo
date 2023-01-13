require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
morgan.token('data', function (req) {
  return JSON.stringify(req.body)
})



app.get('/', (request, response) => {
  response.send('<p>helo</p>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/info', (request, response, next) => {
  Person.find({})
    .then(persons => {
      let n = persons.length
      let info = (`
        <div>
            <p>Phonebook has info on ${n} people</p>
            <p> ${new Date()}</p>
        </div>
    `)
      response.send(info)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()})
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    phonenumber: body.phonenumber,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => {
      next(error)})
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    phonenumber: body.phonenumber
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true,
    runValidators: true, context: 'query' })
    .then(updatedPerson => {
      //      if (typeof updatedPerson === 'null') {
      //        response.status(500).end()
      //      }
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })}

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)})

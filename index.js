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
morgan.token('data', function (req, res) {
    return JSON.stringify(req.body)})
  

app.get('/', (request, response) => {
    response.send('<p>helo</p>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/api/info', (request, response) => {
    let info = (`
        <div>
            <p>Phonebook has info on ${persons.length} people</p>
            <p> ${new Date()}}</p>
        </div>
    `)
    response.send(info)
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) {
          response.json(person)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error)
        
//        {
//        console.log(error)
//        response.status(400).send({ error: 'malformatted id' })
     // }
      )

})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()})
      .catch(error => next(error))    
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        response.status(400).json({ 
          error: 'name missing' 
        })
        return
      }
    if (!body.phonenumber) {
        response.status(400).json({ 
          error: 'phone number missing' 
        })
        return
      }
/*
    if (persons.find(per => per.name === body.name)) {
        response.status(400).json({ 
            error: 'name must be unique' 
          })
          return
    }

    if (persons.find(per => per.phonenumber === body.phonenumber)) {
        response.status(400).json({ 
            error: 'numbr already in use' 
          })
          return
    }
*/
    const person = new Person({
        name: body.name,
        phonenumber: body.phonenumber,
    })
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })


})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)})

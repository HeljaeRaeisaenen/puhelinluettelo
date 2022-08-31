const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
morgan.token('data', function (req, res) {
    return JSON.stringify(req.body)})

let persons = [
      {
        name: "Arto Hellas",
        phonenumber: "040-123456",
        id: 1
      },
      {
        name: "Ada Lovelace",
        phonenumber: "39-44-5323523",
        id: 2
      },
      {
        name: "Dan Abramov",
        phonenumber: "12-43-234345",
        id: 3
      },
      {
        name: "Mary Poppendieck",
        phonenumber: "39-23-6423122",
        id: 4
      }
    ]
  

app.get('/', (request, response) => {
    response.send('<p>helo</p>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
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

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(per => per.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(per => per.id !== id)
  
    response.status(204).end()
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

    const person = {
        name: body.name,
        phonenumber: body.phonenumber,
        id: Math.floor(Math.random() * 1000)
    }
    persons = persons.concat(person)
    response.json(person)


})

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1}


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)})

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://toivotus:${password}@cluster0.45n7qdu.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema(
  { name: String,
    phonenumber: String, }
)
const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  Person
    .find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(person => {
        console.log(person.name, person.phonenumber)
      })
      mongoose.connection.close()
      process.exit(1)
    })
}

const person = new Person({
  name: process.argv[3],
  phonenumber: process.argv[4]
})

person.save().then(result => {
  console.log(`Added ${result.name} number ${result.phonenumber}`)
  mongoose.connection.close()
})
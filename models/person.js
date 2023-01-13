const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

function phonenumberValidator (value) {
  if ((value[2] === '-') || (value[3] === '-')) {
    value = value.replace('-', '')
    for (let i = 0; i < value.length; i++) {
      let parsed = parseInt(value[i])
      if (isNaN(parsed)) return false
    }
  } else return false
  return true
}

const personSchema = new mongoose.Schema(
  { name: {
    type: String,
    minlength: [3, 'Name must be at least 3 characters long'],
    required: true
  },
  phonenumber: {
    type: String,
    minlength: [8, 'Phonenumber must be at least 8 characters long'],
    validate: [phonenumberValidator, 'Phonenumber formatted incorrectly'],
    required: true
  }, }
)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])
const database_name = "phonebook"

const url = `mongodb+srv://JRauta:${password}@cluster0.i3wfz7z.mongodb.net/${database_name}?
retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(() => {
        console.log(`Added person ${process.argv[3]} with number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}

else if (process.argv.length === 3) {

    Person
        .find({})
        .then(result => {
            console.log("Phonebook:")
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
        mongoose.connection.close()
    })
}

else {
    console.log("Invalid number of arguments")
    mongoose.connection.close()
}
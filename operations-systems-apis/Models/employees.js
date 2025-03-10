const moongose = require('mongoose')

const employeeSchema = new moongose.Schema({
    Name: { type: String, required: [true, 'First Name is required'], min: 3 },
    Surname: { type: String, required: [true, 'Last Name is required'] , min: 3},
    Email: { type: String, required: [true, 'email is required'], lowercase: true, index: { unique: true } },
    Department: { type: String, required: [true, 'department is required'], min: 2 },
    Occupation: { type: String, required: [true, 'occupation is required'], min:4 },
})

const Employee =  moongose.model('employee', employeeSchema)

module.exports = Employee
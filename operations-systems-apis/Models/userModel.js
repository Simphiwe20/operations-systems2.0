const mongoose = require('mongoose')

const leaveDays = new mongoose.Schema({
    annualLeaveDays: {type: Number},
    sickLeaveDays: {type: Number},
    familyResponsibilityLeaveDays: {type: Number},
    maternityLeaveDays: {type: Number},
    sickLeaveDays: {type: Number}
})

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, 'First Name is required'], min: 3 },
    lastName: { type: String, required: [true, 'Last Name is required'] , min: 3},
    email: { type: String, required: [true, 'Email is required'], lowercase: true, index: { unique: true } },
    department: { type: String, required: [true, 'Department is required'], min: 2 },
    occupation: { type: String, required: [true, 'Occupation is required'], min:4 },
    role: { type: String, required: [true, 'Role is required'], min: 4 },
    password: { type: String, required: [true, 'Password is required'], min: 8},
    status: {type:String, required: true}, 
    leaveDays: leaveDays
})

const Visa = new mongoose.Schema({
    appID: {type: String, required: true},
    visaType: {type: String, required: true},
    replacementReason: {type: String, required: true},
    department: {type: String, required: true},
    requestedByEmail: {type: String, required: true},
    requestedBy: {type: String, required: true},
    neededDate: {type: Date, required: true},
    status: {type: String, required: true}
})

const User = mongoose.model('User', userSchema)

module.exports = User
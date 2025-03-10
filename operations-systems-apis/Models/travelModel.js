const moongose = require('mongoose')

const travel = moongose.Schema({
    departureDate: {type: String, required: true},
    returnDate: {type: String, required: true},
    travelType: {type: String, required: true},
    reasonForTravel:{type: String, required: true},
    specialNeeds: {type: String, required: true},
    status: {type: String, required: true},
    reqID: {type: String, required: true},
    requestedBy: {type: String, required: true},
    requestedByEmail: {type: String, required: true},
    department: {type: String, required: true},
    dateUpdated: {type: Date, required: false}
})

module.exports = moongose.model('travel', travel)
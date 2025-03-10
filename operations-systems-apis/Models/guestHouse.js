const mongoose = require('mongoose')

const guestHouse = mongoose.Schema({
    specialNeeds: {type: String, require: true},
    reqID : {type: String, require: true, index: {unique: true}},
    requestedBy: {type: String, require: true},
    requestedByEmail: {type: String, require: true},
    department: {type: String, require: true},
    guestHouseName: {type: String, require: true},
    checkInDate: {type: String, require: true},
    checkOutDate: {type: String, require: true},
    specialNeeds: {type: String, require: true},
    status: {type: String, require: true}
})

module.exports = mongoose.model('guestHouse', guestHouse)
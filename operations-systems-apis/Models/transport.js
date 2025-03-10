const moongose = require('mongoose')

const transport = moongose.Schema({
    transportType : {type: String, required: true},
    neededDate: {type: String, required: true},
    pickUpSpot: {type: String, required: true},
    pickUpReason: {type: String, required: true},
    dropOffSpot: {type: String, required: true},
    status: {type: String, required: true},
    reqID: {type: String, required: true},
    requestedBy: {type: String, required: true},
    requestedByEmail: {type: String, required: true},
    department: {type: String, required: true}
})

module.exports = moongose.model('transport', transport)
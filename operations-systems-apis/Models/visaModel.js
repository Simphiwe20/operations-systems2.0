const moongose = require('mongoose')

const visaModel = moongose.Schema({
    visaType: { type: String, require: true },
    replacementReason: { type: String, require: true },
    neededDate: { type: String, require: true },
    status: { type: String, require: true },
    reqID: { type: String, require: true },
    requestedBy: { type: String, require: true },
    requestedByEmail: { type: String, require: true },
    department: { type: String, require: true }
})

module.exports = moongose.model('visa', visaModel)
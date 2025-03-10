const mongoose = require('mongoose')

const leaveSchema = new mongoose.Schema({
    appID: {type: String, required: true},
    leaveType: {type: String, required: true},
    department: {type: String, required: true},
    email: {type: String, required: true},
    employeeName: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    status: {type: String, required: true},
    days: {type: Number, required: true}
})

const leave = mongoose.model('leave', leaveSchema)

module.exports = leave
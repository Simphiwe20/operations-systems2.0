const mongoose = require('mongoose')

const notification = mongoose.Schema({
    message: {type: String, require: true},
    date: {type: Date, require: true},
    viewed: {type: Boolean, require: true},
    type: {type: String, require: true},
    notificationID: {type: String, require: true},
    popedUp: {type: String, require: false}
})

module.exports = mongoose.model('notification', notification) 

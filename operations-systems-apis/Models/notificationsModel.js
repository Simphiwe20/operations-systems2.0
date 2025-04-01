const mongoose = require('mongoose')

const notification = mongoose.Schema({
    message: {type: String, require: true},
    date: {type: Date, require: true},
    for: {type: String, require: true},
    isViewed: {type: Boolean, require: true},
    notificationID: {type: String, require: true},
    popedUp: {type: Boolean, require: false}
})

module.exports = mongoose.model('notification', notification) 

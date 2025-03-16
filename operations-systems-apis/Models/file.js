const moongose = require('mongoose')

const File = new moongose.Schema({
    filename: { type: String},
    contentType: { type: String},
    length: { type: String}
})

const file = moongose.model('File', File)

module.exports = file
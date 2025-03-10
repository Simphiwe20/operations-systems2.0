const express = require('express')
const app = express()

const mongoose = require('mongoose')

// Import cors to allow access for domains 
const cors = require('cors')

mongoose.connect('mongodb+srv://gsimphiwe212:U4v3UtPYlfBFGQz7@operations-db.wt4w7.mongodb.net/?retryWrites=true&w=majority&appName=operations-DB')
    .then(res => console.log('Connection sucessfuly'))
    .catch(err => console.log('We ran into an error', err))

// Using cors on my express app to allow other domains
app.use(cors())

// Using an express json middleware
app.use(express.json())

const routes = require('./routes/routes')
app.use(routes)

app.listen(3000, (req, res) => {
    console.log('Listening to 3000....')
    
})
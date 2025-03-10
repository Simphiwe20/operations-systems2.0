const transport = require('../Models/transport')

module.exports = {
    addTranport: async (req, res) => {
        try {
            let payload = { ...req.body }
            console.log(payload)
            let newTransport = transport(payload)
            console.log(newTransport)
            let result = await newTransport.save()
            console.log(result)
        }catch(err) {
            console.log(err)
            res.status(500).send({Error: 'We ran into an error'})
        }
    },getTransport: async (req, res) => {
        try {
            let Alltransport = await transport.find()
            console.log(Alltransport)
            res.status(201).send(Alltransport)
        }catch {
            res.status(500).send({Error: 'We just ran into an error'})
        }
    }, updateTransport: async (req, res) => {
        try {
            let filter = {reqID: req.body.reqID }
            let options = { upsert: true}
            let updateDoc = {$set: req.body}
            let result = await transport.updateOne(filter, updateDoc, options)
            res.status(201).send(result)
        }
        catch {
            res.status(501).send({Error: 'Sorry we ran into an error'})
        }
    } 
}
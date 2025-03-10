const visa = require('../Models/visaModel')

module.exports = {
    addVisa: async(req, res) => {
        try {
            let payload = {...req.body}
            let newVisa = visa(payload)
            console.log(newVisa)
            let result = await newVisa.save()
            console.log(result)
            res.status(201).send(result)
        }catch {
            res.status(501).send({Error: 'We ran into an error'})
        }
    },
    getVisas: async (req, res) => {
        try {
            let visas = await visa.find()
            console.log(visas)
            res.status(201).send(visas)
        }catch {
            res.status(500).send({Error: 'We ran into an error'})
        }
    },updateVisa: async (req, res) => {
        try {
            let filter = {reqID: req.body.reqID}
            let options = {upsert: true}
            let updateDoc = { $set: req.body}
            let result = await visa.updateOne(filter, updateDoc, options)
            res.status(201).send(result)
        }catch {
            res.status(501).send({Error: 'We ran into an error'})
        }
    }

}
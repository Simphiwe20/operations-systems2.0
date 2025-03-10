const travel = require('../Models/travelModel')

module.exports = {
    addTravel: async (req, res) => {
        try {
            let payload = { ...req.body }
            let newTravel = travel(payload)
            let result = await newTravel.save()
            console.log(result)
            res.status(201).send(result)
        }catch {
            res.status(500).send({Error: 'We ran into an error'})
        }
    }, gettravel: async (req, res) => {
        try {
            let allTravel = await travel.find()
            console.log(allTravel)
            res.status(201).send(allTravel)
        }catch {
            res.status(500).send({Error: 'We just ran into an error'})
        }
    }, updateTravel: async (req, res) => {
        try {
            let filter  = {reqID: req.body.reqID}
            let options = {upsert: true}
            let updateDoc = {$set: req.body}
            let result = await travel.updateOne(filter, updateDoc, options)
            res.status(201).send(result)
        }catch (err){
            console.log(err)
            res.status(501).send({Error: 'We ran into an erro'})
        }
    } 
}
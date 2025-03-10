const guestHouse = require('../Models/guestHouse')

module.exports = {
    getGHRequests: async (req, res) => {
        try {
            let GHRequests = await guestHouse.find()
            console.log(GHRequests)
            res.status(201).send(GHRequests)
        }catch {
            res.status(500).send({Error: 'We ran into an error'})
        }
    },
    requestGH: async (req, res) => {
        try {
            let payload = {...req.body}
            let newGH = guestHouse(payload)
            let result = await newGH.save()
            console.log(result)
            res.status(201).send(result)
        }catch {
            res.status(500).send({Error: 'Sorry we ran into an error'})
        }
    },
    getRequestByEmail: async (req, res) => {
        try {
            let email = { ...req.params }
            console.log(email)
            let _res = await guestHouse.find(email)
            console.log(_res)
            res.status(200).send(_res)
        }catch (err){
            console.log(err)
            console.log({Error: 'We ran into an error'})
        }
    },
    updateGHRequest: async (req, res) => {
        try {
            let filter  = {reqID: req.body.reqID}
            let options = {upsert: true}
            let updateDoc = {$set: req.body}
            let result = await guestHouse.updateOne(filter, updateDoc, options)
            res.status(201).send(result)
        }catch (err){
            console.log(err)
            res.status(501).send({Error: 'We ran into an erro'})
        }
    }
}
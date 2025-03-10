const leave = require('../Models/leaveModel')

module.exports = {
    addLeave: async (req, res) => {
        try {
            let payload = { ...req.body }
            let newLeave = leave(payload)
            console.log(newLeave)
            let result = await newLeave.save()
            console.log(result)
            res.status(201).send(result)
        } catch {
            res.send.status(501).send({ Error: 'We ran into an error' })
        }
    },
    getLeaves: async (req, res) => {
        try {
            let leaves = await leave.find()
            console.log(leaves)
            res.status(201).send(leaves)
        } catch {
            console.log({ Error: 'We ran into an error' })
        }
    }, updateLeave: async (req, res) => {
        try {
            let filter = { appID: req.body.appID }
            let options = { upsert: true }
            let updateDoc = { $set: req.body }
            let result = await leave.updateOne(filter, updateDoc, options)
            res.status(201).send(result)
        } catch (err) {
            console.log(err)
            res.status(501).send({ Error: 'We ran into an erro' })
        }
    }
}

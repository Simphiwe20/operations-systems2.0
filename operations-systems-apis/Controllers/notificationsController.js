const notification = require('../Models/notificationsModel')

module.exports = {
    addNotification: async (req, res) => {
        try {
            let payload = { ...req.body }
            let newNotification = notification(payload)
            let result = await newNotification.save()
            res.status(201).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(500).send({ Error: 'We just ran into an error' })
        }
    },
    getNotification: async (req, res) => {
        try {
            let notifications = await notification.find()
            console.log(notifications)
            res.status(201).send(notifications)
        } catch {
            res.status(500).send({ Error: 'We have just ran into an error' })
        }
    },
    updateNotification: async (req, res) => {
        try {
            const filter = { notificationID: req.body.notificationID }
            const options = { upsert: true }
            const updates = { $set: req.body }

            const updatedNotifications= await notification.updateOne(filter, updates, options)
            res.send(201 ,updatedNotifications)
        }
        catch {
            res.send("We ran into an error")
        }
    }
}
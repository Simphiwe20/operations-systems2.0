// Import the user schema
const User = require('../Models/userModel')
const bcrypt = require('bcrypt');
const saltRounds = 10;
let UsersPwd = []
// Import nodemailer to be used to email passwords
const nodemailer = require('nodemailer')

// Method for sending passwords to users
const sendPassword = (payload) => {

    let mailTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, //2525 (specific port)
        secureConnection: true, //true or false
        auth: {
            user: 'gsimphiwe212@gmail.com',
            pass: 'kkdvatjekgzlwrvr'
        }
    })

    let details = {
        from: 'gsimphiwe212@gmail.com',
        to: `${payload.email}`,
        subject: 'Account',
        text: `Hey ${payload.firstName} ${payload.lastName}, your user account has been successfully created and your password is ${payload.password}. Use your email address and this password to log in. `
    }

    mailTransporter.sendMail(details, (err) => {
        if (err) {
            console.log('It has an error', err)
        } else {
            console.log('Email send successfully')
        }
    })
}

module.exports = {
    defaultRoute: async (req, res) => {
        try {
            const allUsers = await User.find()
            console.log("Found Users: ", allUsers)
            res.send(allUsers)
        } catch (err) {
            res.send(err)
        }
        console.log(this.UsersPwd)
    },
    getUserByEmail: ('/getUserByEmail/:email', async (req, res) => {
        try {
            const query = req.params
            const foundUser = await User.findOne(query)
            res.status(200).send(foundUser)
            console.log(foundUser)
        } catch {
            res.status(500).send('We ran into an error')
        }
    }),
    addUsers: async (req, res) => {
        console.log("requests body: ", req)
        UsersPwd.push({
            email: req.body.email,
            password: req.body.password
        })
        console.log(UsersPwd)
        try {
            let payload = { ...req.body }
            console.log("payload", payload)
            sendPassword(payload)
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(payload.password, salt, async (err, hash) => {
                    payload['password'] = hash
                    console.log(payload)
                    const newUser = User(payload)
                    const result = await newUser.save()
                    console.log(result)
                    res.status(200).send(newUser)
                });
            });
        } catch (err) {
            if (req.body.email === 'admin@neutrinos.co') {
                return
            } else {
                res.status(501).send(err)
            }
        }
    },
    signIn: async (req, res) => {
        try {
            let foundUser = await User.findOne({ email: req.body.email })
            console.log(foundUser)
            console.log('req.body.email: ', req.body.email)
            if (foundUser) {
                bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
                    console.log(req.body.password)
                    console.log(foundUser.password)
                    if (result) {
                        console.log(result)
                        if (foundUser.status === 'active') {
                            res.status(200).send(foundUser)
                        } else {
                            res.status(403).send({ Error: 'Account disabled, contact your admin' })
                        }
                    } else {
                        res.status(401).send({ Error: "Password does not match" })
                        // res.status(200).send(foundUser)

                    }
                });
            } else {
                res.status(404).send({ Error: 'User not found' })
            }
        } catch {
            res.send('We ran into an error')
        }
    },
    updateUser: async (req, res) => {
        try {
            const filter = { email: req.body.email }
            const options = { upsert: true }
            const updates = { $set: req.body }

            const updatedUser = await User.updateOne(filter, updates, options)
            res.send(updatedUser)
        }
        catch {
            res.send("We ran into an error")
        }
    },
    updatePwd: async (req, res) => {
        try {
            const filter = { email: req.body.email }
            const options = { upsert: true }
            const updates = { ...req.body }
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(updates.password, salt, async (err, hash) => {
                    updates['password'] = hash
                    let updatedUser = { $set: updates }
                    const result = await User.updateOne(filter, updatedUser, options)
                    res.status(200).send(result)
                });
            });
        }
        catch {
            res.send("We ran into an error")
        }
    },
    deleteUser: async (req, res) => {
        try {
            const filter = req.params
            const deletedUser = User.deleteOne(filter)
            if ((await deletedUser).deletedCount === 0) {
                res.status(200).send('User was sucessfully deleted')
            } else {
                res.status(500).send('User was not deleted successfully')
            }
        }
        catch {
            res.status(501).send('We ran into an error')
        }
    }
}


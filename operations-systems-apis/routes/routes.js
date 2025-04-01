const express = require('express')
const router = express.Router()
const multer = require("multer");

// import controllers
const userController = require('../Controllers/userControllers') 
const employeeController = require('../Controllers/employeeController')
const leavesController = require('../Controllers/leavesController')
const guestHouseController = require('../Controllers/guestHouseController')
const visaController = require('../Controllers/visaControllers')
const transportController = require('../Controllers/transportController')
const travelController = require('../Controllers/travelController')
const notificationController = require('../Controllers/notificationsController')
const docsController = require('../Controllers/fileController')

// 
const storage = multer.memoryStorage()
const upload  =   multer({storage})

// Users routes
router.get('/get-users', userController.defaultRoute)
router.get('/getUserByEmail/:email', userController.getUserByEmail)
router.post('/add-user', userController.addUsers)
router.post('/sign-in', userController.signIn)
router.put('/update-user', userController.updateUser)
router.put('/update-password', userController.updatePwd)
router.delete('/delete-user/:email', userController.deleteUser)


// EMPLOYEES routers
// add employees router
router.post('/add-employees', employeeController.addEmployees)
// Get employees router
router.get('get-employees', employeeController.getAllEmployees)


// Leaved routes
// Apply for a leave
router.post('/apply-leave', leavesController.addLeave)
// Getting all the leaves
router.get('/get-leaves', leavesController.getLeaves)
// Update leaves request
router.put('/updateLeave', leavesController.updateLeave)

// GuestHouse routes
// Request for guesthouse
router.get('/getGHRequests', guestHouseController.getGHRequests)
// Requesting for a guesthouse
router.post('/requestGH', guestHouseController.requestGH)
// Update a guesthouse requests 
router.put('/updateGHRequest', guestHouseController.updateGHRequest)


// Visa requests route
// Get visas
router.get('/getVisas', visaController.getVisas)
// Requesting for a visa request
router.post('/addVisa', visaController.addVisa)
// Update visa requests
router.put('/updateVisa', visaController.updateVisa)

// Transport requests route
// Get transport
router.get('/getTransport', transportController.getTransport)
// Requesting a transport
router.post('/addTransport', transportController.addTranport)
// Update transport request
router.put('/updateTransport', transportController.updateTransport)

// Travel requests route
// Get travel
router.get('/getTravel', travelController.gettravel)
// Request travel
router.post('/addTravel', travelController.addTravel)
// Update Travel request
router.put('/updateTravel', travelController.updateTravel)

// Notifications routes
// Post or Add notifications
router.post('/add-notification', notificationController.addNotification)
// Get notifications
router.get('/get-notification', notificationController.getNotification)

// Documents routes
router.post('/upload', upload.single("file"), docsController.uploadDocument)
router.get('/file', docsController.getFile)
router.get('/files', docsController.getDocs)

module.exports = router
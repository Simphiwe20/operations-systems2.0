// Import expess to get the router
const express = require('express')

// Import router
const router = express.Router()

// import controllers
const userController = require('../Controllers/userControllers') 
const employeeController = require('../Controllers/employeeController')
const leavesController = require('../Controllers/leavesController')
const guestHouseController = require('../Controllers/guestHouseController')
const visaController = require('../Controllers/visaControllers')
const transportController = require('../Controllers/transportController')
const travelController = require('../Controllers/travelController')
const notificationController = require('../Controllers/notificationsController')

// Users routes
// Get all users route
router.get('/get-users', userController.defaultRoute)
// Get users by email, route
router.get('/getUserByEmail/:email', userController.getUserByEmail)
// add users router
router.post('/add-user', userController.addUsers)
// sign-in router
router.post('/sign-in', userController.signIn)
// update users router
router.put('/update-user', userController.updateUser)
// Delete users router
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

module.exports = router
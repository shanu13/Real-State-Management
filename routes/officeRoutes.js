//importing necessary modules

const express = require('express');
const router = express.Router();
const officeContoller = require('../controllers/officeController')


//route for office login
router.get('/login',officeContoller.getLogin)
//fetches the login credentials
//verify the login credentials
router.post('/login',officeContoller.postLogin);

//render the office home page
router.get('/', officeContoller.getOfficeHome);


//route to view profile of each agent
router.get('/profile/:agentId',officeContoller.getAgentProfile);

//route to add a new agent
router.get('/add_agent', officeContoller.getAddAgent);
router.post('/add_agent', officeContoller.postAddAgent);

//route to add a new property
router.get('/add_property', officeContoller.getAddProperty);
router.post('/add_property', officeContoller.postAddProperty);


//route to view total properties
router.get('/total_properties', officeContoller.getTotalProperties);


//route to view sold properties
router.get('/total_sold_properties', officeContoller.getTotalSoldProperties);


//route to view all rented properties
router.get('/total_rented_properties', officeContoller.getTotalRentedProperties);

module.exports = router;
const express = require('express');
const router = express.Router();
const agentContoller = require('../controllers/agentController')



//login route
router.get('/login',agentContoller.getLogin)


//fetches the login credentials
//verify the login credentials
router.post('/login',agentContoller.postLogin);


//render the agent home page
router.get('/', agentContoller.getAgenthome);


//route to add new property
router.get('/add_property/:agentId', agentContoller.getAddProperty);
router.post('/add_property',agentContoller.postAddProperty);


//route to update current status of properties
router.post('/update/:propertyId', agentContoller.postUpdateProperty);


module.exports = router;
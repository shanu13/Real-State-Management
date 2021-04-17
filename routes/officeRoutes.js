const express = require('express');
const router = express.Router();
const officeContoller = require('../controllers/officeController')

router.get('/login',officeContoller.getLogin)

router.post('/login',officeContoller.postLogin);

router.get('/', officeContoller.getOfficeHome);

router.get('/profile/:agentId',officeContoller.getAgentProfile);

router.get('/add_agent', officeContoller.getAddAgent);

router.post('/add_agent', officeContoller.postAddAgent);

router.get('/add_property', officeContoller.getAddProperty);

router.post('/add_property', officeContoller.postAddProperty);

module.exports = router;
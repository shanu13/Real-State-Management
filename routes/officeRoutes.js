const express = require('express');
const router = express.Router();
const officeContoller = require('../controllers/officeController')

router.get('/login',officeContoller.getLogin)

router.post('/login',officeContoller.postLogin);

router.get('/', officeContoller.getOfficeHome);

router.get('/profile/:agentId',officeContoller.getAgentProfile);


module.exports = router;
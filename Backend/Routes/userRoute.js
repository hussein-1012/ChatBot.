const express = require('express');
const router = express.Router();
const { Register } = require('../Controllers/userController');
const { login } = require('../Controllers/userController');
const {allUsers} = require('../Controllers/userController');
const {protect} = require('../middleware/authMiddle_ware');


router.route('/').post(Register).get(protect,allUsers); 
router.route('/login').post(login); 

module.exports = router;
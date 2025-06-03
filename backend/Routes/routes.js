const express = require('express');
const {addinguser,enteruser,googlelogin} = require('../Controller/usercontroller');


const router = express.Router();;

router.post('/creatinguser',addinguser);

router.post('/loginginuser',enteruser)

router.post('/google',googlelogin)


module.exports = router

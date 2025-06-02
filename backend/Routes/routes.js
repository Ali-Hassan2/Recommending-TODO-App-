const express = require('express');
const {addinguser,enteruser} = require('../Controller/usercontroller');


const router = express.Router();;

router.post('/creatinguser',addinguser);

router.post('/loginginuser',enteruser)


module.exports = router
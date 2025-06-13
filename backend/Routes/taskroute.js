const express = require('express');
const router = express.Router();

const {addingtask,gettingtask,updatetask,deletetask, gettingrecomend} = require('../Controller/taskcontroller')


router.post('/addingtask',addingtask);
router.get('/gettask/:userid',gettingtask);
router.put('/updatetask/:taskid',updatetask);
router.delete('/deletetask/:taskid',deletetask);
router.get('/recomendation/:userid',gettingrecomend);

module.exports = router
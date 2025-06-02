const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const colors = require('colors')
const morgan = require('morgan');

const mysqlpool = require('./Config/db')


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

const port = process.env.PORT || 4005;


app.get('/',(req,res)=>{
    res.status(200).send("Hello g");
})


mysqlpool.query('SELECT 1').then(()=>{
    console.log("MySql Connected".bgBlack.green);
    app.listen(port,(req,res)=>{console.log(`Server is listening at the port number ${port}`.bgBlack.green)})
}).catch((error)=>{
    console.log("There is an error while connecting to the mysql.",error.bgBlack)
})






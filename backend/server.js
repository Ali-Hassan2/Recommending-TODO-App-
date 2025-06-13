const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const colors = require('colors');
const morgan = require('morgan');
const mysqlpool = require('./Config/db');
const userrouter = require('./Routes/routes')
const taskrouter = require('./Routes/taskroute')

dotenv.config();

const app = express();
const port = process.env.PORT || 4005;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/todo',userrouter)
app.use('/todo',taskrouter);

app.get('/', (req, res) => {
    res.status(200).send("Hello g");
});

mysqlpool.query('SELECT 1')
    .then(() => {
        console.log("MySQL Connected".bgBlack.green);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`.bgBlack.green);
        });
    })
    .catch((error) => {
        console.error("MySQL connection error:", error.message.bgRed.white);
    });

const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql2.createPool({
    host:process.env.HOST || 'localhost',
    user:process.env.USER_NAME || 'root',
    password:process.env.PASSWORD || '1234',
    database:process.env.DATABASE || 'Unknow Database',
})

module.exports = pool;
const {google} = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();


const client_id = process.env.CLIENTID;
const client_secret = process.env.CLIENTSECRET;

exports.oauth2client = new google.auth.OAuth2(
    client_id,
    client_secret,
    'http://localhost:5173'
)


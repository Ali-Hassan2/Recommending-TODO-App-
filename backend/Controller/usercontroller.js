const express = require('express');
const pool = require('../Config/db');
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const { oauth2client } = require('../Utils/googleConfig');
const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');
const axios = require('axios')
dotenv.config();



const addinguser = async (req, res) => {


    await Promise.all([
        check('name', "Name is required").notEmpty().run(req),
        check('username', "Username is required").notEmpty().run(req),
        check('password', "password must be greater then 6 characters").isLength({ min: 6 }).run(req)
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            errors: errors.array(),
        })
    }

    try {

        const { name, username, password } = req.body;
        if (!name || !username || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the fields"
            })
        }
        const [existingRows] = await pool.query('SELECT * FROM Userr WHERE username = ?', [username]);

        if (existingRows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "The user with this username already exist please try again."
            })
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO Userr(name,username,password) values (?,?,?)', [name, username, hashedpassword]
        )
        if (result.affectedRows === 0) {
            return res.status().send({
                succes: false,
                message: "Cannot create the User."
            })
        }
        res.status(200).json({
            success: true,
            message: 'Student Successfully created Bro'
        })
    }
    catch (error) {
        console.log("there is an error while creating the new user", error);
        return res.status(500).json({
            success: false,
            message: "cannot create the user",
            error: error
        })
    }
}


const enteruser = async (req, res) => {
    await Promise.all([
        check('username', "Username is required").notEmpty().run(req),
        check('password', "Password is required").notEmpty().run(req)
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(409).json({
            success: false,
            error: errors.array(),
        });
    }

    try {
        const { username, password: enteredPassword } = req.body;

        const [result] = await pool.query('SELECT * FROM Userr WHERE username = ?', [username]);

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }




        const user = result[0];

        const payload = {
            id: user.id,
            name: user.name,
            username: user.username
        }

        console.log("User found", user);
        console.log("The entered password is: ", enteredPassword.trim());
        console.log("The db password is: ", user.password);

        const isMatch = await bcrypt.compare(enteredPassword.trim(), user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        } else {
            console.log("Password matched, you will be logged into the system");
        }
        const token = jsonwebtoken.sign(payload, process.env.JWTSECRET || "thisissecred", { expiresIn: '1h' });

        return res.status(200).json({
            success: true,
            message: "Successful login",
            token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        });
    }
};



const googlelogin = async (req, res) => {
    try {
      const code = req.body.code;
      console.log("The code is: ",code)
      if (!code) {
        return res.status(400).send({
          success: false,
          message: "Authorization code is missing",
        });
      }
  
      const { tokens } = await oauth2client.getToken(code);
      oauth2client.setCredentials(tokens);
  
      const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
      );
  
      const { email, name, picture } = userRes.data;
  
      const [existinguser] = await pool.query("SELECT * FROM Userr WHERE email = ?", [email]);

      let user;
  
      if (existinguser.length > 0) {
        user = existinguser[0];
      } else {
        const [adduser] = await pool.query(
          "INSERT INTO Userr (name, username, email) VALUES (?, ?, ?)",
          [name, email, email]
        );
  
        const [newUser] = await pool.query('SELECT * FROM Userr WHERE id = ?', [adduser.insertId]);
        user = newUser[0];
      }
  
      const payload = {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email
      };
  
      const token = jsonwebtoken.sign(payload, process.env.JWTSECRET || "This is the secret", {
        expiresIn: '1h'
      });
  
      return res.status(200).send({
        success: true,
        token,
        message: 'Logged in using Google account',
        user
      });
    } catch (error) {
      console.error("Google login error:", error);
      return res.status(401).json({
        success: false,
        message: "Cannot login with Google",
        error: error.message
      });
    }
  };
module.exports = { addinguser, enteruser, googlelogin }
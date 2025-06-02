const express = require('express');
const pool = require('../Config/db');
const {check,validationResult} = require('express-validator')
const bcrypt = require('bcrypt')


const addinguser = async (req, res) => {


    await Promise.all([
        check('name',"Name is required").notEmpty().run(req),
        check('username',"Username is required").notEmpty().run(req),
        check('password',"password must be greater then 6 characters").isLength({min:6}).run(req)
    ]);

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({
            success:false,
            errors:errors.array(),
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
        const [existingRows] = await pool.query('SELECT * FROM User WHERE username = ?', [username]);

        if (existingRows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "The user with this username already exist please try again."
            })
        }

        const hashedpassword = await bcrypt.hash(password,10);
        const [result] = await pool.query(
            'INSERT INTO User(name,username,password) values (?,?,?)', [name, username, hashedpassword]
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
        const { username, password } = req.body;

        const [result] = await pool.query('SELECT * FROM User WHERE username = ?', [username]);

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Successful login",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
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

module.exports = { addinguser,enteruser }
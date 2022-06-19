const { Router } = require('express');
const express = require('express');
const { type } = require('express/lib/response');
const moment = require('moment');
const { findUser, createUser } = require('../../utils/index');
const bcrypt = require("bcrypt");
 
const router = express.Router();
 
// finding user, logging user in
router.get('/signin', async (req, res) => {
    try {
        const email = req.query['email'];
        const password = req.query['password'];
 
        const conditions = {};
        if (email) conditions.email = email;
        if (password) conditions.password = password;
        const [findUserError, user] = await findUser(conditions);
 
        if (findUserError) {
            throw new Error('Error retrieving account', conditions);
        }
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                user
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error retrieving account', error);
        res.json('Error retrieving account');
    }
});
// signing up the user (creating account)
router.post('/signup', async (req, res) => {  // note that the frontend has to route to signup
    try {
        if (!req.body.email || !req.body.fullname || !req.body.password) {
            throw new Error('Missing parameters');
        }
        const email = req.body.email;
        const password = req.body.password;
        const fullname = req.body.fullname;
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        const [createAccountError, user] = await createUser(
            email,
            fullname,
            password,
            dateTime
        );
        if (createAccountError) {
            throw createAccountError;
        }
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                user
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error creating account', error);
        res.json(`Error creating account: ${error}`);
    }
});
module.exports = router;

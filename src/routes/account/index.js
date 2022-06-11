const { Router } = require('express');
const express = require('express');
const { type } = require('express/lib/response');
const moment = require('moment');
const { findUser, createUser } = require('../../utils/index');
 
const router = express.Router();
 
// finding user, logging user in
router.get('/', async (req, res) => {
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
// creating user
router.post('/', async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            throw new Error('Missing parameters');
        }
        const email = req.body.email;
        const password = req.body.password;
       
        const [createAccountError, user] = await createUser(
            email,
            password
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

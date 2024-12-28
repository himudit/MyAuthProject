const express = require('express');
const { validateSignUpData } = require('../utils/validation')
const validator = require('validator');
const authRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// authRouter.use();

authRouter.post('/signup', async (req, res) => {
    try {
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName, lastName, emailId, password: passwordHash
        });

        await user.save();
        res.send("User added successfully");
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});


authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) {
            throw new Error("Invalid Credentials")
        }
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await user.verifyPassword(password);

        if (isPasswordValid) {
            // Create a JWT token
            const token = await user.getJWT();

            // Add token to cookie and send the response back to user
            res.cookie('token', token);
            res.status(201).json({ token, user });
        } else {
            throw new Error("Invalid Credentials");
        }

    } catch (err) {
        res.status(400).send({ error: err.message });
    }

})

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successfully")
})

module.exports = authRouter;
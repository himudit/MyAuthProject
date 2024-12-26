const express = require('express');

const authRouter = express.Router();

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
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            // Create a JWT token
            const token = await user.getJWT();

            // Add token to cookie and send the response back to user
            res.cookie('token', token);
            res.send("User logged in successfully");
        } else {
            throw new Error("Invalid Credentials");
        }

    } catch (err) {
        res.status(400).send({ error: err.message });
    }

})

module.exports = authRouter;
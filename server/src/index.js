const express = require('express');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user')
const { validateSignUpData } = require('./utils/validation')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
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

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId)) {
            throw new Error("Invalid Credentials")
        }
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            // Create a JWT token
            const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790");
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

app.get('/profile', userAuth, async (req, res) => {
    try {
        // const cookies = req.cookies;
        // console.log(cookies);
        // const { token } = cookies;
        // if (!token) {
        //     throw new Error("Invalid Token")
        // }
        // // Validate my token
        // const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
        // const { _id } = decodedMessage;
        // const user = await User.findById(_id);
        // if (!user) {
        //     throw new Error("User does not exist");
        // }
        res.send(req.user);
    } catch (err) {
        res.send(err);
    }
})

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = [
            "photoUrl", "about", "gender", "age"
        ]
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("Update Not Allowed");
        }
        if (data?.skills.length > 10) {
            throw new Error("Skills can not be more than 10");
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "after",
            runValidators: true,
        })
        res.send("User Updated Successfully")
    } catch (err) {
        res.status(400).send("Update Failed" + err.message);
    }
})

app.post('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
        res.send(user.firstName);

    } catch (err) {
        res.status(400).send(err.message)
    }
})

connectDB()
    .then(() => {
        console.log("Database connected Successfully");
        app.listen(3000, () => {
            console.log("Server running at 3000");
        })
    })
    .catch(err => { console.log(err) });

app.get('/', (req, res) => {
    return res.send('Hello');
})
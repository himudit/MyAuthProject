const express = require('express');
const connectDB = require('./config/database')
const app = express();
const User = require('./models/user')
const { validateSignUpData } = require('./utils/validation')
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middlewares/auth');

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);

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
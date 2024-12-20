const express = require('express');
const connectDB = require('./config/database')
const app = express();

const User = require('./models/user')

app.use(express.json());

app.post('/signup', async (req, res) => {
    const tryobj = req.body;
    const user = new User(tryobj);

    await user.save().then(() => {
        res.send("added successfully");
        console.log("user added cuccessfully")
    })
        .catch(err => console.error('Error:', err));
})

app.get('/profile', async (req, res) => {
    try {
        const user = await User.find({ emailId: req.body.emailId });
        res.send(user);
    } catch {
        res.send("nothing");
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
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,

    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        
    },
    photoUrl: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/256/149/149071.png"
    },
    about: {
        type: String,
        default: "This is a Default about of user"
    },
    skills: {
        type: [String],
    }

});
const User = mongoose.model("user", userSchema)
module.exports = User;
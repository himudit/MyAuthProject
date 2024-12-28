const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = jwt.sign({ _id: this._id }, "DEV@Tinder$790");
    return token;
}
userSchema.methods.verifyPassword = async function (passwordInputByUser) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, this.password);
    return isPasswordValid;
}

const User = mongoose.model("user", userSchema)
module.exports = User;
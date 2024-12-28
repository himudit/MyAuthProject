const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("email is not correct")
    } else if (!password) {
        throw new Error("Please Enter a  Password!")
    }
}

module.exports = {
    validateSignUpData
}
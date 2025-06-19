const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        // the below string is refering to our database MERNDB
    )
}
module.exports = connectDB; 

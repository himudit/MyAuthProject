const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        // the below string is refering to our database MERNDB
        'mongodb+srv://himudit:1IWgzt3YQJLOPtt9@clustermern.ro00k.mongodb.net/MERNDB'
    )
}
module.exports = connectDB; 
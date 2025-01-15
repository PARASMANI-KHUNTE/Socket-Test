const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    email : {
        type : String,
        unique : true
    },
    password : {
        type :String,
    },
    AvtarUrl :{
        type : String
    }
})

const user = new mongoose.model("user",UserSchema);

module.exports = user;
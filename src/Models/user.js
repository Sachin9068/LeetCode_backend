const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20
    },
    emailId:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        lowercase:true,
        immutale:true,

    },
    age:{
        type:Number,
        min:6,
        max:90
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    problemSolved:{
        type:[String]
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})

const user = mongoose.model('user',userSchema);
module.exports = user;
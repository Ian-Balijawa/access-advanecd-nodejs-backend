const Joi = require("joi")
const jsonwebtoken = require("jsonwebtoken")
const config = require("config")
const mongoose = require("mongoose")

const userSchema = new mongoose.schema({
        name:{
            type: String,
            required:true,
            minlength: 3,
            maxlength: 255,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 255
            unique:true,
            trim:true,
        },
        password: {
            type:String,
            minlength:5
            maxlength:255,
        },
        isAdmin:{type: Boolean, default: false},
        isGold: {type: Boolean, default: false,}
    })

const userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, email:this.email,isAdmin:this.isAd                       min}, config.get("jwtPrivatekey"))

    return token;
}

const User = mongoose.model("User", userSchema);

function validateUser(user){
    const schema = Joi.object({
        name:Joi.string().required().min(3).max(255).trim(),
        email:Joi.string().required().email().min(6).max(255),
        password:Joi.string().required().min(5).max(255),
        isAdmin: Joi.bool(),
        isGold:Joi.bool(),
    })

    return schema.validate(user);
}


module.exports = {
    validate: validateUser,
    User,
}

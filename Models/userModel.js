const express = require("express")
const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const userSchema = mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique: true
        
    },
    password :  String,
    phonenumber : Number,
    role : {
        type : String,
        default : "user"
    },
    photo : {
        id : {
            type : String
        },
        secure_url : {
            type : String
        }
    },
    forgetPasswordToken : {
        type : String,
        default : ""
    },
    forgetPasswordExpires : {
        type : Date,
        default : ""
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
})

userSchema.pre("save" , async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password = await bcrypt.hash(this.password , 10)
    
})

userSchema.methods.isPasswordValid = async(password , encPassword ) => {

    console.log(password , encPassword)

    return await bcrypt.compare( password , encPassword)
}

userSchema.methods.getToken = function(){
    return  jwt.sign( { id : this._id } , "thisissecretkey" , {
        expiresIn : Date.now() + 10 *60 * 1000
    })
}

userSchema.methods.forgetToken =  function(){

    let forgetToken =  crypto.randomBytes(20).toString("hex")

    this.forgetPasswordToken = forgetToken 

    this.forgetPasswordExpires = Date.now() + 20 * 60 * 60

    console.log(this.forgetPasswordToken, this.forgetPasswordExpires)

    return forgetToken
}


module.exports = mongoose.model("user" , userSchema)
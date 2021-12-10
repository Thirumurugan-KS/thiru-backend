const cloudinary = require("cloudinary").v2
const { mailSend } = require("../Utils/mailSender")
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel")

cloudinary.config({
    cloud_name : 'dirl9qdbz',
    api_key : '366751568763697',
    api_secret : '0Tzbzs-pqoH3jlAelvnwNEl7eRg'
})


// signup 
exports.signUp = async (req,res) => {
    
   try{

    const { name , email , password , phonenumber } = req.body
    const user = await User.create({name , email , password , phonenumber})
    console.log(user)
    if(user){
        let cloud = await cloudinary.uploader.upload(req.files.photo.tempFilePath , {
            folder : "profile"
        })
        user.photo.id = cloud.public_id
        user.photo.secure_url = cloud.secure_url
        await user.save()
        res.json({user,
        status : "ok"})
    }
    else{
        res.send("Already user present")
    }
   }
   catch(error){
       console.log("Error occured")
   }
}

// signin
exports.signIn = async (req,res) => {

    const { email , password} = req.body

    const user = await User.findOne({ email })

    if(!user){
        res.json({
            message : "User not found",
            status : "fail"
        })
    }
    else{

    const isValid = await user.isPasswordValid(password , user.password)
    if(!isValid){

        res.json({
            message : "Email or password is incorrect",
            status : "fail"
        })

    }
    else {
        let token = user.getToken()
        res.cookie("token" ,  token, {
            httpOnly : true,
            expiresIn : Date.now() * 3 * 60 * 60 * 1000
        }).json({
            status : "ok",
            user : user,
            token : token
        })
    }   
    }
 
}

//signout

exports.signOut = (req,res) => {

    res.clearCookie("token")
    res.json({
        status : "ok",
        success : "true"
    })
}

//forget password

exports.forgetPassword = async(req,res) => {

    const { email } = req.body

    let user = await User.findOne({email})

    if(!user){
        res.json({
            status : "fail",
            message : "Mail not found"
        })
    }

    forgetToken = await user.forgetToken()

    await user.save()

    let value = {
        fromMail : "admin@ecom.com",
        toMail : user.email,
        subject : "Forget Password",
        text : "Kindly follow below link to forget password",
        html : `<a href='http://localhost:8080/password/reset/${forgetToken}'> <button>Click Me</button></a>`
    }

    let mail =  mailSend(value)

    res.json({
        status : "Ok"
    })
}

//reset forget password

exports.resetForgetPassword = async(req,res) => {
    const forgetToken = req.params.token
    const { newPassword } = req.body

    const user = await User.findOne({ forgetPasswordToken : forgetToken })

    if(!user){
        res.json({
            status : "fail"
        })
    }

    if(user.forgetPasswordExpires < Date.now()){
        res.json({
            message : "Token Expires",
            status : "fail"
        })
    }

    user.password = newPassword

    user.forgetPasswordToken = ""
    user.forgetPasswordExpires = ""

    await user.save()

    res.json({
        status : "ok"
    })
}

// user dashboard

exports.userDashboard = async(req,res) => {
    
    const user = await User.findById(req.id)
    if(!user){
        res.json({
            message : "User not found",
            status : "fail"
        })
    }

    res.json({
        user,
        status : "ok"
    })
}

// password update after login

exports.passwordUpdate = async(req,res) => {

    const { oldPassword , newPassword } = req.body

    const id = req.id

    const user = await User.findById(id)

    console.log(user)

    if(!user){

        res.json({
            message : "User not found",
            status : "fail"
        })

    }

     if(await user.isPasswordValid(oldPassword , user.password)===false){
        res.json({
            message : "Password not matching",
            status : "fail"
        })
     }

     user.password = newPassword

     await user.save()

     res.json({
        message : "Password Changed",
        status : "ok"
    })

}


// Admin Dashboard display all user

exports.adminUsers = async(req,res) => {

    const users = await User.find({})

    res.json(users)
}

//Admin seeing specific user

exports.adminUser = async(req,res) => {

    const id = req.params.id

    try{const user = await User.findById(id)

    if(!user){
       res.json(
        {message : "User not found",
        status : "fail"}
       )
    }

    res.json(user)
}
catch(error){
    res.json(
        {message : "User not found",
        status : "fail"}
       )
}
}

exports.adminModifyUser = async(req,res) => {

    const id = req.params.id

    const { name , phonenumber } = req.body

    console.log(req.body)

    try{
        const user = await User.findById(id)

    if(!user){
       res.json(
        {message : "User not found",
        status : "fail"}
       )
    }

    user.name = name 

    user.phonenumber = phonenumber
    
    await user.save( {validateBeforeSave : true})

    res.json(user)
}
catch(error){
    res.json(
        {message : "User not found",
        status : "fail"}
       )
}
}

exports.adminDeleteUser = async(req,res) => {

    const id = req.params.id


    try{
        const user = await User.findById(id)

    if(!user){
       res.json(
        {message : "User not found",
        status : "fail"}
       )

    }

    await User.deleteOne({ _id : id })

    res.json({
        message : "deleted successfully",
        status : "ok"
    })

}
catch(error){


}

}
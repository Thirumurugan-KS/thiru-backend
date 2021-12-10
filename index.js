const cloudinary = require("cloudinary")
require("dotenv").config()
const mongoose = require('mongoose');
const app = require("./App")

mongoose.connect('mongodb+srv://thiru:thiru@cluster0.xoecv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' , ()=>{
    console.log('DB Connected')
});

app.listen( process.env.PORT || 8080 , ()=>{
    console.log('Server is up')
})
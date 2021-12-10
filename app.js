const express = require("express")

const app = express()

const User = require("./Routes/userRoute")

app.use("/api" , User)

module.exports = app
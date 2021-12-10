const express = require("express")
const fileUpload = require("express-fileupload")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const app = express()

const User = require("./Routes/userRoute")

app.use("/api" , User)
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload())

module.exports = app
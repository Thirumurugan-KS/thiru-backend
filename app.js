const express = require("express")
const fileUpload = require("express-fileupload")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/temp/"
}))

const User = require("./Routes/userRoute")

app.use("/api" , User)

module.exports = app
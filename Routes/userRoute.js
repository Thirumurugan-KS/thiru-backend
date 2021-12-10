const express = require("express")
const { home } = require("../Components/homeComponent")
const {signUp, signIn, signOut, forgetPassword, resetForgetPassword, userDashboard , 
    passwordUpdate, adminUsers , adminUser, adminModifyUser ,adminDeleteUser} = require("../Components/userComponent")
const { isLogin , isAdmin } = require("../Middlewares/userMiddleware")
const router = express.Router()

//Routes

//Home Route
router.route("/").get(home)

//User Route
router.route("/signup").post(signUp)
router.route("/signin").post(signIn)
router.route("/signout").get(signOut)
router.route("/forgetpassword").post(forgetPassword)
router.route("/password/reset/:token").post(resetForgetPassword)
router.route("/userdashboard").get(isLogin ,userDashboard)
router.route("/passwordupdate").post(isLogin , passwordUpdate)

//Admin Route
router.route("/admin/users").get(isLogin ,isAdmin ,adminUsers)
router.route("/admin/user/:id").get(isLogin ,isAdmin ,adminUser)
router.route("/admin/user/:id").post(isLogin ,isAdmin ,adminModifyUser)
router.route("/admin/user/:id").delete(isLogin ,isAdmin ,adminDeleteUser)

module.exports = router
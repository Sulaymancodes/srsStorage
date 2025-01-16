const { Router } = require("express");
const passport = require('passport');
const loginRouter = Router();
const loginController = require("../controllers/loginController");

loginRouter.get("/log-in", loginController.getLogin);
loginRouter.post("/log-in",  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/log-in'
   }));

module.exports = loginRouter;
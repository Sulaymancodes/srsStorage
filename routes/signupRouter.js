const { Router } = require("express");
const signupRouter = Router();
const signupController = require("../controllers/signupController");

signupRouter.get("/sign-up", signupController.getSignup);

module.exports = signupRouter;
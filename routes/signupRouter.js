const { Router } = require("express");
const signupRouter = Router();
const signupController = require("../controllers/signupController");

signupRouter.get("/sign-up", signupController.getSignup);
signupRouter.post("/sign-up", signupController.createUser);

module.exports = signupRouter;
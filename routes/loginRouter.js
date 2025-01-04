const { Router } = require("express");
const loginRouter = Router();
const loginController = require("../controllers/loginController");

loginRouter.get("/log-in", loginController.getLogin);

module.exports = loginRouter;
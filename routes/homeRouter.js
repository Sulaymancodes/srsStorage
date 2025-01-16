const { Router } = require('express');
const homeRouter = Router();
const homeController = require('../controllers/homeController');

homeRouter.get("/home", homeController.getHome);
homeRouter.get("/log-out", homeController.logOutUser);

module.exports = homeRouter;
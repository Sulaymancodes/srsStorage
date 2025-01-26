const { Router } = require('express');
const homeRouter = Router();
const homeController = require('../controllers/homeController');


homeRouter.get("/home", homeController.getHome);
homeRouter.get("/log-out", homeController.logOutUser);
homeRouter.post("/create-folder", homeController.createFolder);
homeRouter.post("/update-folder/:id", homeController.updateFolder); 
homeRouter.post("/delete-folder/:id", homeController.deleteFolder); 

module.exports = homeRouter;
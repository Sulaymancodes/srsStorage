const { Router } = require("express");
const folderRouter = Router();
const folderController = require("../controllers/folderController");

folderRouter.get("/:id/folder", folderController.getFolder);

module.exports = folderRouter;
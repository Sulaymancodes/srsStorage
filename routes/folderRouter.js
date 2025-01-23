const { Router } = require("express");
const folderRouter = Router();
const folderController = require("../controllers/folderController");
const path = require("path");
const multer  = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = path.join(__dirname, "../uploads", req.body.folderId);
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage })

folderRouter.get("/:id/folder", folderController.getFolder);
folderRouter.post('/uploadfile', upload.single('uploaded_file'), folderController.uploadFile);

module.exports = folderRouter;
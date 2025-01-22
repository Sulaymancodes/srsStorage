const { Router } = require('express');
const homeRouter = Router();
const homeController = require('../controllers/homeController');
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

homeRouter.get("/home", homeController.getHome);
homeRouter.get("/log-out", homeController.logOutUser);
homeRouter.post("/create-folder", homeController.createFolder);
homeRouter.post('/uploadfile', upload.single('uploaded_file'), homeController.uploadFile);

module.exports = homeRouter;
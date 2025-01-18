const { Router } = require('express');
const homeRouter = Router();
const homeController = require('../controllers/homeController');
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/Users/hp/repos/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage })

homeRouter.get("/home", homeController.getHome);
homeRouter.get("/log-out", homeController.logOutUser);
homeRouter.post('/uploadfile', upload.single('uploaded_file'), function (req, res) {
   console.log(req.file.filename)
});

module.exports = homeRouter;
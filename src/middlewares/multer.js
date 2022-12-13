const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    console.log('fileeeeee',file);
    cb(null, file.originalname)
  },
});

var upload = multer({ storage: storage, limits: { fieldSize: 25 * 1024 * 1024 } });


module.exports = upload;

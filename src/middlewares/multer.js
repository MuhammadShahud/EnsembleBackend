const multer = require('multer');
const uploads = multer({dest: 'uploads/'});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../assets/product/uploads');
  },
  filename: (req, file, cb) => {},
});

module.exports = uploads;

const router = require("express").Router();
const path = require("path");

//POST all uploads of files to the server
router.post("/upload", (req, res, next) => {
  let uploadFile = req.files.file;

  //Create name of file + checksum (md5) to prevent overwriting the files
  const name = uploadFile.name + '-' + uploadFile.md5;
  const aboveCurrentFolder = path.resolve(__dirname, '../..');
  uploadFile.mv(`${aboveCurrentFolder}/public/${name}`, function(err){
    if (err)
    {
      return res.status(500).send(err);
    }
    return res.status(200).json({ status: 'uploaded', name, name});
  });
});


module.exports = router;

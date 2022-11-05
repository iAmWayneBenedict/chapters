const router = require('express').Router()
const multer = require("multer");
const upload = multer({ dest: '/public/vids' })

const { getPath, getDirPath, getKeyMoments, openVidsDirectory } = require('../controller/FilesController')
const fs = require("fs");

router.post("/get-path", upload.single("vid"), getPath)

router.get("/get-dir-path/:filename", getDirPath)

router.get("/open-directory", openVidsDirectory);

router.post("/get-key-moments", getKeyMoments)

module.exports = router;
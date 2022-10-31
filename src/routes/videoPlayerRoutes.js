const router = require('express').Router()

const {home, add} = require('../controller/VideoPlayerController')

router.get("/", home);

router.get("/public/vids/:data", home);

router.post("/add", add);

module.exports = router;
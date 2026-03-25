const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send("Pet routes working (demo)");
});

module.exports = router;
const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

// @route Get api/products/test
// @Desc Tests products route
// @access Public
router.get('/test', (req, res) => {
  res.json({ msg: 'products works' });
});

module.exports = router;

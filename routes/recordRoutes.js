const recordController = require('../controllers/recordController');
const express = require('express');
const router = express.Router();

router
.route('/upload')
.post(recordController.uploadRecord);

module.exports = router;
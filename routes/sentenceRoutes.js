const sentenceController = require('../controllers/sentenceController');
const express = require('express');

const router = express.Router();

router
.route('/call')
.get(sentenceController.call);

router
.route('/endCall')
.get(sentenceController.endCall);

router
.route('/openChat')
.get(sentenceController.openChat);

router
.route('/closeChat')
.get(sentenceController.closeChat);

router
.route('/openedChat')
.get(sentenceController.openedChat);

router
.route('/readMessages')
.get(sentenceController.readMessages);

router
.route('/textMessage')
.get(sentenceController.textMessage);

router
.route('/voiceMessage')
.get(sentenceController.voiceMessage);

router
.route('/block')
.get(sentenceController.block);

router
.route('/unblock')
.get(sentenceController.unblock);

module.exports = router;
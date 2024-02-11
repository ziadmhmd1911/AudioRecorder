const sentenceModel = require('../models/sentenceModel');

function getSentence(sentenceName){
    const [text, index , order , name , command] = sentenceModel.sentences.get(sentenceName).getSentence();
    return {
        text: text,
        index: index,
        order: order,
        name: name,
        command: command
    };
}
exports.call = (req, res) =>{
    const sentence = getSentence('call');
    res.status(200).json({
        status: 'success',
        data: sentence
    });
}

exports.endCall = (req, res) =>{
    const sentence = getSentence('endCall');
    res.status(200).json({
        status: 'success',
        data: sentence
    });
}

exports.openChat = (req, res) =>{
    const sentence = getSentence('openChat');
    res.status(200).json({
        status: 'success',
        data: sentence
    });
}

exports.closeChat = (req, res) =>{
    const sentence = getSentence('closeChat');
    res.status(200).json({
        status: 'success',
        data: sentence
    });
}

exports.openedChat = (req, res) =>{
    const sentence = getSentence('openedChat');
    res.status(200).json({
        status: 'success',
        data: sentence
    });
}

exports.readMessages = (req, res) =>{
    const sentence = getSentence('readMessages');
    res.status(200).json({
        status: 'success',
        data: sentence
    });
}

exports.textMessage = (req, res) =>{
    const sentence = getSentence('textMessage');
    res.status(200).json({
        status: 'success',
        data: sentence
    });
}

exports.voiceMessage = (req, res) =>{
    const sentence = getSentence('voiceMessage');
    res.status(200).json({
        status: 'success',
        data: sentence
    });
}

exports.block = (req, res) =>{
    const sentence = getSentence('block');
    res.status(200).json({
        status: 'success',
        data: sentence
    });
}

exports.unblock = (req, res) =>{
    const sentence = getSentence('unblock');
    res.status(200).json({
        status: 'success',
        data: sentence
    });
}
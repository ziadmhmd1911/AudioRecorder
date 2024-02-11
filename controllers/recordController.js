const fs = require('fs');
const Record = require('../models/recordModel');
const sentences = require('../models/sentenceModel').sentences;

//counts the number of lines in the dataset.csv file
//counter = fs.readFileSync('recordsData/dataset.csv').toString().split('\n').length - 2;
counter = 0;
console.log('counter:', counter);
exports.uploadRecord = async (req, res) => {
    if (!req.files) {
        return res.status(400).json({
            status: 'fail',
            message: 'No files were uploaded.'
        });
    }
    
    const voice = req.files.audio;
    
    const fileName = `${counter}.wav`;
    //const path = `${__dirname.replace('/controllers','')}/recordsData/audio/${fileName}`;
    
    /*voice.mv(path, async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: 'fail',
                message: 'Server error.'
            });
        }*/
        
        try{
            Record.create({
                index: counter,
                text: req.body.text,
                order: req.body.order,
                name: req.body.name,
                command: req.body.command
            });
            saveParams(req);
            sentences.get(req.body.command).pointerIncrement(req.body.index);
        }
        catch(err){
            return res.status(500).json({
                status:'fail',
                message:'cant save record'
            });
        }
        counter++;
        res.status(200).json({
            status: 'success',
            message: 'File uploaded successfully.'
        });
   // });
}

function saveParams(req){
    body = req.body;
    tuple = `${counter},${body.text},${body.order},${body.name},${body.command}\n`;
    
    fs.appendFile('recordsData/dataset.csv', tuple, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
          return;
        }
    });
      
}
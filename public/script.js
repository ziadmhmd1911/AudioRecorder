document.addEventListener('DOMContentLoaded', () => {
    const startRecordButton = document.getElementById('startRecord');
    const stopRecordButton = document.getElementById('stopRecord');
    const deleteRecordButton = document.getElementById('deleteRecord');
    const audioElement = document.getElementById('audio');
    const callButton = document.getElementById('call');
    const endCallButton = document.getElementById('endCall');
    const openChatButton = document.getElementById('openChat');
    const closeChatButton = document.getElementById('closeChat');
    const openedChatButton = document.getElementById('openedChat');
    const readMessagesButton = document.getElementById('readMessages');
    const textMessageButton = document.getElementById('textMessage');
    const voiceMessageButton = document.getElementById('voiceMessage');
    const blockButton = document.getElementById('block');
    const unblockButton = document.getElementById('unblock');
    const sendButton = document.getElementById('send');
    const nextButton = document.getElementById('next');
    const previousButton = document.getElementById('previous');

    const sentenceLabel = document.getElementById('sentence');

    callButton.addEventListener('click', call);
    endCallButton.addEventListener('click', endCall);
    openChatButton.addEventListener('click', openChat);
    closeChatButton.addEventListener('click', closeChat);
    openedChatButton.addEventListener('click', openedChat);
    readMessagesButton.addEventListener('click', readMessages);
    textMessageButton.addEventListener('click', textMessage);
    voiceMessageButton.addEventListener('click', voiceMessage);
    blockButton.addEventListener('click', block);
    unblockButton.addEventListener('click', unblock);

    sendButton.addEventListener('click', send)
    nextButton.addEventListener('click', next);
    previousButton.addEventListener('click', previous);

    startRecordButton.addEventListener('click', startRecording);
    startRecordButton.addEventListener('click', togglePulse); // Add event listener to startRecordButton to toggle pulse animation
    startRecordButton.addEventListener('click', toogleWaveForm);
    stopRecordButton.addEventListener('click', stopRecording);
    deleteRecordButton.addEventListener('click', deleteRecord);
    stopRecordButton.addEventListener('click', stopWaveform);
    deleteRecordButton.addEventListener('click', stopWaveform);
    
    let index;
    let text;
    let order;
    let name;
    let command;

    let audioBlob;
    let recorder;
    let audioChunks = [];
    let timerInterval;
    let elapsedTime = 0;
    const maxRecordingTime = 10; // Set the maximum recording time limit in seconds

    function toogleWaveForm() {
        const bars = document.querySelectorAll('.bar');
        for (let i = 0; i < bars.length; i++) {
            bars.forEach(each => {
                each.style.animationDuration = `${Math.random() * (0.75 - 0.25) + 0.25}s`; 
            });
        }
    }

    function stopWaveform() {
        const bars = document.querySelectorAll('.bar');
        bars.forEach(each => {
            each.style.animationDuration = '0s';  // Set animation duration to 0 to stop the animation
        });
    }

    function togglePulse() {
        var startRecordButton = document.getElementById('startRecord');
        if (!startRecordButton.classList.contains('pulsing')) {
            startRecordButton.classList.add('pulsing'); // Add the "pulsing" class to start the pulse animation
        } else {
            startRecordButton.classList.remove('pulsing'); // Remove the "pulsing" class to stop the pulse animation
        }
    }


    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                recorder = new MediaRecorder(stream);
    
                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        audioChunks.push(e.data);
                    }
                };
    
                recorder.onstop = () => {
                    audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    audioElement.src = audioUrl;
    
                    deleteRecordButton.disabled = false;
                    clearInterval(timerInterval);
                    elapsedTime = 0;
                    startRecordButton.disabled = true;
    
                    // Add the line below to remove the "pulsing" class when recording stops
                    startRecordButton.classList.remove('pulsing');
                };
    
                recorder.onstart = () => {
                    timerInterval = setInterval(() => {
                        updateElapsedTime();
                        if (elapsedTime >= maxRecordingTime) {
                            stopRecording(); // Automatically stop recording after reaching the time limit
                        }
                    }, 1000);
                };
    
                recorder.start();
                startRecordButton.disabled = true;
                stopRecordButton.disabled = false;
                deleteRecordButton.disabled = true;
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
            });
    }
    
    function stopRecording() {
        recorder.stop();
        startRecordButton.disabled = true;
        stopRecordButton.disabled = true;
        deleteRecordButton.disabled = false;
    
        // Add the line below to remove the "pulsing" class when recording stops
        startRecordButton.classList.remove('pulsing');
    }
    
    function deleteRecord() {
        audioElement.src = '';
        deleteRecordButton.disabled = true;
        stopRecordButton.disabled = true;
        audioChunks = [];
        clearInterval(timerInterval);
        elapsedTime = 0;
        updateElapsedTime();
        startRecordButton.disabled = false; // Enable start button when recorded audio is deleted
    
        // Add the line below to remove the "pulsing" class when recording is deleted
        startRecordButton.classList.remove('pulsing');
    }

    function updateElapsedTime() {
        elapsedTime++;
        audioElement.setAttribute('data-time', formatTime(elapsedTime));
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function send(){
        if (audioChunks.length === 0) {
            alert('No audio to send');
            return;
        }

        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');
        const additionalData = {
            index: index,
            text: text,
            order: order,
            name: name,
            command: command,
        };
    
        Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, value);
        });
    
        fetch('api/v1/record/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Audio data sent:', data);
        })
        .catch(error => {
            console.error('Error sending audio data:', error);
        });
        deleteRecord();
    }

    function call() {
        command = 'call';
        fetch('api/v1/sentence/call')
            .then(response => response.json())
            .then(data => {
                console.log('Call sentence:', data);
                index = data.data.index;
                text = data.data.text;
                order = data.data.order;
                name = data.data.name;
                sentenceLabel.textContent = text;
            })
            .catch(error => {
                console.error('Error getting call sentence:', error);
            });
        previousButton.disabled = true;
        nextButton.disabled = false;
    }
    call();

    function endCall() {
        command = 'endCall';
        fetch('api/v1/sentence/endCall')
            .then(response => response.json())
            .then(data => {
                console.log('End call sentence:', data);
                index = data.data.index;
                text = data.data.text;
                order = data.data.order;
                name = data.data.name;
                sentenceLabel.textContent = text;
            })
            .catch(error => {
                console.error('Error getting end call sentence:', error);
            });
        previousButton.disabled = false;
        nextButton.disabled = false;
    }

    function openChat() {
        command = 'openChat';
        fetch('api/v1/sentence/openChat')
            .then(response => response.json())
            .then(data => {
                console.log('Open chat sentence:', data);
                index = data.data.index;
                text = data.data.text;
                order = data.data.order;
                name = data.data.name;
                sentenceLabel.textContent = text;
            })
            .catch(error => {
                console.error('Error getting open chat sentence:', error);
            });
        previousButton.disabled = false;
        nextButton.disabled = false;
    }

    function closeChat() {
        command = 'closeChat';
        fetch('api/v1/sentence/closeChat')
            .then(response => response.json())
            .then(data => {
                console.log('Close chat sentence:', data);
                index = data.data.index;
                text = data.data.text;
                order = data.data.order;
                name = data.data.name;
                sentenceLabel.textContent = text;
            })
            .catch(error => {
                console.error('Error getting close chat sentence:', error);
            });
        previousButton.disabled = false;
        nextButton.disabled = false;
    }

    function openedChat() {
        command = 'openedChat';
        fetch('api/v1/sentence/openedChat')
            .then(response => response.json())
            .then(data => {
                console.log('Opened chat sentence:', data);
                index = data.data.index;
                text = data.data.text;
                order = data.data.order;
                name = data.data.name;
                sentenceLabel.textContent = text;
            })
            .catch(error => {
                console.error('Error getting opened chat sentence:', error);
            });
        previousButton.disabled = false;
        nextButton.disabled = false;
    }

    function readMessages() {
        command = 'readMessages';
        fetch('api/v1/sentence/readMessages')
            .then(response => response.json())
            .then(data => {
                console.log('Read messages sentence:', data);
                index = data.data.index;
                text = data.data.text;
                order = data.data.order;
                name = data.data.name;
                sentenceLabel.textContent = text;
            })
            .catch(error => {
                console.error('Error getting read messages sentence:', error);
            });
        previousButton.disabled = false;
        nextButton.disabled = false;
    }

    function textMessage() {
        command = 'textMessage';
        fetch('api/v1/sentence/textMessage')
            .then(response => response.json())
            .then(data => {
                console.log('Text message sentence:', data);
                index = data.data.index;
                text = data.data.text;
                order = data.data.order;
                name = data.data.name;
                sentenceLabel.textContent = text;
            })
            .catch(error => {
                console.error('Error getting text message sentence:', error);
            });
        previousButton.disabled = false;
        nextButton.disabled = false;
    }

    function voiceMessage() {
        command = 'voiceMessage';
        fetch('api/v1/sentence/voiceMessage')
            .then(response => response.json())
            .then(data => {
                console.log('Voice message sentence:', data);
                index = data.data.index;
                text = data.data.text;
                order = data.data.order;
                name = data.data.name;
                sentenceLabel.textContent = text;
            })
            .catch(error => {
                console.error('Error getting voice message sentence:', error);
            });
        previousButton.disabled = false;
        nextButton.disabled = false;
    }

    function block() {
        command = 'block';
        fetch('api/v1/sentence/block')
            .then(response => response.json())
            .then(data => {
                console.log('Block sentence:', data);
                index = data.data.index;
                text = data.data.text;
                order = data.data.order;
                name = data.data.name;
                sentenceLabel.textContent = text;
            })
            .catch(error => {
                console.error('Error getting block sentence:', error);
            });
        previousButton.disabled = false;
        nextButton.disabled = false;
    }

    function unblock() {
        command = 'unblock';
        fetch('api/v1/sentence/unblock')
            .then(response => response.json())
            .then(data => {
                console.log('Unblock sentence:', data);
                index = data.data.index;
                text = data.data.text;
                order = data.data.order;
                name = data.data.name;
                sentenceLabel.textContent = text;
            })
            .catch(error => {
                console.error('Error getting unblock sentence:', error);
            });
        previousButton.disabled = false;
        nextButton.disabled = true;
    }
    

    function next(){
        if(command === 'call'){
            endCall();
        } else if(command === 'endCall'){
            openChat();
        }
        else if(command === 'openChat'){
            closeChat();
        }
        else if(command === 'closeChat'){
            openedChat();
        }
        else if(command === 'openedChat'){
            readMessages();
        }
        else if(command === 'readMessages'){
            textMessage();
        }
        else if(command === 'textMessage'){
            voiceMessage();
        }
        else if(command === 'voiceMessage'){
            block();
        }
        else if(command === 'block'){
            unblock();
        }
    }

    function previous(){
        if(command === 'endCall'){
            call();
        } else if(command === 'openChat'){
            endCall();
        }
        else if(command === 'closeChat'){
            openChat();
        }
        else if(command === 'openedChat'){
            closeChat();
        }
        else if(command === 'readMessages'){
            openedChat();
        }
        else if(command === 'textMessage'){
            readMessages();
        }
        else if(command === 'voiceMessage'){
            textMessage();
        }
        else if(command === 'block'){
            voiceMessage();
        }
        else if(command === 'unblock'){
            block();
        }
    }
    
});

const names = ['محمد','علي','محمود','احمد','عبدالله','عبدالرحمن','عبدالعزيز','سيد','سعيد','سلمان','سليمان','سامي','سامح','سامر','اسعد','زياد',
                'وائل','طارق','ايهاب','صلاح','وليد','هاني','هادي','ياسر','بهاء','علاء','مهاب'];

class Sentence {
    constructor(sentences){
        this.sentences = sentences;
        this.counter = 0;
    }

    getRandName(){
        // no of names to be used in the sentence
        const namesLimit = 2;
        const noNames = Math.floor(Math.random() * namesLimit) + 1;
        let name = '';
        for(let i = 0; i < noNames; i++){
            const index = Math.floor(Math.random() * names.length);
            name += names[index] + ' ';
        }
        name = name.trim();
        return name;
    }

    checkNameInSentence(sentence){
        if (sentence.includes('x')){
            const name = this.getRandName();
            return [sentence.replace(/x/g, name), name];
        }
        
        return [sentence, ''];
    }

    getSentence(){
        // order update to be used in the sentence
        const index = this.counter % this.sentences.length;
        const sentence = this.sentences[index];
        const order = sentence[1];
        const command = this.constructor.name;
        const [renderedSentence, name] = this.checkNameInSentence(sentence[0]);
        return [renderedSentence, index , order , name , command];
    }

    pointerIncrement(index){
        if(index == this.counter % this.sentences.length){
            this.counter++;
        }
    }
}

exports.call = new Sentence([['اتصل بx','اتصل'],
                            ['اتصل على x','اتصل'],
                            ['اتصل','اتصل'],
                            ['اتصال','اتصال'],
                            ['مكالمة','مكالمة'],
                            ['ابدا مكالمة مع x','مكالمة']]);

exports.endCall = new Sentence([['انهي المكالمة','انهي المكالمة'],
                               ['انهي الاتصال','انهي الاتصال'],
                               ['اغلق المكالمة','اغلق المكالمة'],
                               ['اغلق الاتصال','اغلق الاتصال']]);

exports.openChat = new Sentence([['افتح الدردشة مع x','افتح الدردشة'],
                                ['افتح الشات مع x','افتح الشات'],
                                ['ابدأ الدردشة مع x','ابدأ الدردشة'],
                                ['افتح المحادثة مع x','افتح المحادثة']
                                ['افتح محادثة x','افتح محادثة'],
                                ['افتح شات x','افتح شات']]);

exports.closeChat = new Sentence([['اغلق الدردشة','اغلق الدردشة'],
                                  ['اغلق الشات','اغلق الشات'],
                                  ['اغلق المحادثة','اغلق المحادثة'],
                                  ['انهي الدردشة','انهي الدردشة'],
                                  ['انهي الشات','انهي الشات'],
                                  ['انهي المحادثة','انهي المحادثة']]);

exports.openedChat = new Sentence([['محادثة من مفتوحة الان','محادثة مفتوحة'],
                                   ['هل توجد محادثة مفتوحة','محادثة مفتوحة'],
                                    ['ما هي المحادثة الحالية','المحادثة الحالية']]);

exports.readMessages = new Sentence([['اقرا رسائل x','اقرا رسائل'],
                                     ['اقرا الرسائل','اقرا الرسائل']]);

exports.textMessage = new Sentence([['ارسل رسالة نصية الى x','رسالة نصية'],
                                    ['رسالة نصية الى x','رسالة نصية'],
                                    ['ارسل رسالة نصية','رسالة نصية'],]);

exports.voiceMessage = new Sentence([['ارسل رسالة صوتية الى x','رسالة صوتية'],
                                     ['ارسل رسالة صوتية','رسالة صوتية'],]);

exports.block = new Sentence([['قم بحظر x','حظر'],
                              ['حظر','حظر'],
                              ['حظر x','حظر']]);

exports.unblock = new Sentence([['قم بفك الحظر عن x','فك الحظر'],
                                ['فك الحظر عن x','فك الحظر'],
                                ['فك الحظر','فك الحظر']]);

const sentences = new Map();
sentences.set('call', exports.call);
sentences.set('endCall', exports.endCall);
sentences.set('openChat', exports.openChat);
sentences.set('closeChat', exports.closeChat);
sentences.set('openedChat', exports.openedChat);
sentences.set('readMessages', exports.readMessages);
sentences.set('textMessage', exports.textMessage);
sentences.set('voiceMessage', exports.voiceMessage);
sentences.set('block', exports.block);
sentences.set('unblock', exports.unblock);


exports.sentences = sentences;
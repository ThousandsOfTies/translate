class SpeechRecognizer {
    constructor(recpause_btn_id, talk_func) {
        this.STOP_TEXT = 'STOP';
        this.REC_TEXT = 'REC';
        this.recpause_btn_id = recpause_btn_id;
        document.querySelector('#' + this.recpause_btn_id).value = this.REC_TEXT;
        this.talk_func = talk_func;

        let SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'en';
        this.recognition.continuous = true;
        this.recognition.addEventListener('result', (ev) => {
            var text;
            for (var i = ev.resultIndex; i < ev.results.length; i++) {
                var result = ev.results.item(i);
                if (result.final === true || result.isFinal === true) {
                    text = result.item(0).transcript;
                }
            }
            this.talk_func(text);
        });
        this.recognition.addEventListener('start', (ev) => {
            document.querySelector('#' + this.recpause_btn_id).value = this.STOP_TEXT;
        });
        this.recognition.addEventListener('end', (ev) => {
            document.querySelector('#' + this.recpause_btn_id).value = this.REC_TEXT;
        });
        document.querySelector('#' + this.recpause_btn_id).addEventListener('click', (ev) => {
            if (ev.currentTarget.value == this.STOP_TEXT) {
                this.recognition.stop();
            } else if (ev.currentTarget.value == this.REC_TEXT) {
                this.recognition.start();
            }
        });

    }
}


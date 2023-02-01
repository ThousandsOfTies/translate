class SpeechSynthesiser {
    constructor(list_id) {
        this.list_id = list_id;
        speechSynthesis.addEventListener('voiceschanged', ev => {
            this.updateVoiceSelect();
        });
        this.voice = {};
    }
    setVoice(name) {
        let voice = speechSynthesis.getVoices().filter(voice => voice.name === name)[0];
        this.voice = voice;
    }
    speak(text) {
        const uttr = new SpeechSynthesisUtterance(text);
        uttr.voice = this.voice;
        speechSynthesis.speak(uttr);
    }
    updateVoiceSelect() {
        const voices = speechSynthesis.getVoices();
        let elm = document.querySelector('#' + this.list_id);
        elm.innerHTML = '';

        let matched_voices = [];
        voices.forEach(v => {
            if (!v.lang.match('en-US')) {
                return;
            }
            const option = document.createElement('option');
            option.value = v.name;
            option.text = `${v.name} (${v.lang});`;
            option.setAttribute('selected', v.default);
            elm.appendChild(option);
            matched_voices.push(v);
        });
        let arg_voice = matched_voices.filter(voice => voice.name == elm.value)[0];
        this.setVoice(arg_voice.name);
    }
}

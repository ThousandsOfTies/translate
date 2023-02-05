class StatementSynthesiser {
    constructor(elm, statement_class_name) {
        this.statements_place = elm;
        this.statement_class_name = statement_class_name;
        this.voice = {};
        this.num = 0;
        this.prevX = 0;
        this.prevY = 0;
    }
    setVoice(voice) {
        this.voice = voice;
    }
    insertStatements(statements) {
        statements.forEach(statement => {
            const add_code = '<span id="' + this.num++ + '" class="' + this.statement_class_name + ' draggable" data-origin="' + statement + '">' + statement + '</span>';
            this.statements_place.insertAdjacentHTML('beforeend', add_code);
        });
        document.querySelectorAll("." + this.statement_class_name).forEach(elm => {
            elm.addEventListener('mousedown', ev => {
                ev.target.classList.add("holding");
            });
            elm.addEventListener('mousemove', ev => {
                if (ev.target.classList.contains('holding') == false) {
                    return;
                }
                ev.target.classList.add("dragging");
                var style = getComputedStyle(ev.target);
                ev.target.style.top = (parseInt(style.top, 10) + ev.movementY) + "px";
                ev.target.style.left = (parseInt(style.left, 10) + ev.movementX) + "px";
            });
            elm.addEventListener('mouseup', ev => {
                let isDragging = ev.target.classList.contains('dragging');
                ev.target.classList.remove("dragging");
                ev.target.classList.remove("holding");
                if (isDragging) {
                    return;
                }
                const uttr = new SpeechSynthesisUtterance(ev.target.textContent);
                uttr.voice = this.voice;
                speechSynthesis.speak(uttr);
            });
            elm.addEventListener('mouseout', ev => {
                ev.target.classList.remove("holding");
                ev.target.classList.remove("dragging");
            });

            // taouch panel用
            elm.addEventListener('touchstart', ev => {
                ev.target.classList.add("holding");
                this.prevX = ev.touches[0].clientX;
                this.prevY = ev.touches[0].clientY;
            });
            elm.addEventListener("touchmove", ev => {
                let x = ev.touches[0].clientX - this.prevX;
                let y = ev.touches[0].clientY - this.prevY;
                this.prevX = ev.touches[0].clientX;
                this.prevY = ev.touches[0].clientY;
                if (ev.target.classList.contains('dragging') == false) {
                    return;
                }
                var style = getComputedStyle(ev.target);
                ev.target.style.top = (parseInt(style.top, 10) + y) + "px";
                ev.target.style.left = (parseInt(style.left, 10) + x) + "px";
            });
            elm.addEventListener('touchend', ev => {
                ev.target.classList.remove("holding");
            });
        });
    }
    translateIntoEng() {
        document.querySelectorAll('.' + this.statement_class_name).forEach(statement => {
            fetch('https://script.google.com/macros/s/AKfycbzaYhG3i8Q8G-jp0t5DK04qAe7v11od6WVdcNtkvrR6a58b4CbBSgdWmW4QWZ4kFM3l/exec?translate="' + statement.textContent + '"&source=ja&target=en')
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    return statement.textContent = json;
                });
        });
    }
    translateBack() {
        document.querySelectorAll('.' + this.statement_class_name).forEach(statement => {
            statement.textContent = statement.dataset.origin;
        });
    }
}

let wt = document.querySelector("#working_tray");
let ss = new StatementSynthesiser(wt, "statement");
ss.insertStatements(["千尋がイチゴを食べる。", "千尋は バナナ　食べる。", "麻衣子は 携帯 電話する。"]);

function updateVoiceSelect(elm) {
    const voices = speechSynthesis.getVoices();
    elm.innerHTML = '';
    const lang = document.querySelectorAll('.lang_selector.current')[0].id;
    const ptn = {
        'jan': 'ja',
        'eng': 'en-US'
    }[lang];

    let matched_voices = [];
    voices.forEach(v => {
        if (!v.lang.match(ptn)) {
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
    ss.setVoice(arg_voice);
}
let voiceSelect = document.querySelector('#voice-select');
voiceSelect.onchange = ev => {
    ss.setVoice(speechSynthesis
        .getVoices()
        .filter(voice => voice.name === ev.target.value)[0]);
};
speechSynthesis.onvoiceschanged = e => {
    updateVoiceSelect(voiceSelect);
}

document.querySelectorAll('.lang_selector').forEach(elm => {
    elm.addEventListener('click', ev => {
        document.querySelectorAll('.lang_selector').forEach(elm => {
            elm.classList.remove('current');
        });
        ev.target.classList.add('current');
        updateVoiceSelect(voiceSelect);
        if (ev.target.id == 'eng') {
            ss.translateIntoEng();
        } else {
            ss.translateBack();
        }
    });
});

let voiceTest = document.querySelector('#voice-test');
voiceTest.addEventListener('click', function () {
    const uttr = new SpeechSynthesisUtterance("Hello, world!");
    uttr.voice = speechSynthesis
        .getVoices()
        .filter(voice => voice.name === voiceSelect.value)[0];
    speechSynthesis.speak(uttr);
});

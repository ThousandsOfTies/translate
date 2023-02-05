class StatementTranslater {
    constructor(working_root_id, speak_func) {
        this.working_root_id = working_root_id;
        this.statemenmts_tray_class = 'statemenmts_tray';
        this.statement_class = 'statemenmt';
        this.speak_func = speak_func;
        this.voice = {};
        this.num = 0;
        this.prevX = 0;
        this.prevY = 0;
        this.makeWorkPlace();
    }
    setVoice(voice) {
        this.voice = voice;
    }
    makeWorkPlace() {
        let root = document.querySelector('#' + this.working_root_id);
        root.insertAdjacentHTML('beforeend', '<div class="' + this.statemenmts_tray_class + ' tray"></div>');
        [
            "千尋がイチゴを食べる。",
            "千尋は バナナ　食べる。",
            "麻衣子は 携帯 電話する。"
        ].forEach(statement => {
            const add_code = '<span id="' + this.num++ + '" class="' + this.statement_class + ' draggable" data-origin="' + statement + '">' + statement + '</span>';
            document.querySelector('#' + this.working_root_id).insertAdjacentHTML('beforeend', add_code);
        });
        document.querySelectorAll("." + this.statement_class).forEach(elm => {
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
                this.speak_func(ev.target.textContent);
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
        document.querySelectorAll('.' + this.statement_class).forEach(statement => {
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
        document.querySelectorAll('.' + this.statement_class).forEach(statement => {
            statement.textContent = statement.dataset.origin;
        });
    }
}

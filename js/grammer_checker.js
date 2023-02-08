class GrammerChecker {
    constructor(working_root_id, icon_list, speak_func) {
        this.working_root_id = working_root_id;
        this.statemenmt_tray_class = 'statemenmt_tray';
    }
    makeWorkPlace(icon_list) {
        let root = document.querySelector('#' + this.working_root_id);
        root.insertAdjacentHTML('beforeend', '<div class="' + this.statemenmt_tray_class + ' tray"></div>');
        root.insertAdjacentHTML('beforeend', '<table><tr><td><div class="words">{入力}</div></td><td>⇒</td><td><div class="eng">{英語}</div></td></tr></table>');
        root.insertAdjacentHTML('beforeend', '<div class="' + this.words_tray_class + ' tray"></div>');

        icon_list.forEach(item => {
            const add_code = '<img class="' + this.word_class + ' draggable" src="' + item.img + '" data-text="' + item.text + '" alt="' + item.text + '" draggable="false"/>';
            document.querySelector('#' + this.working_root_id + ' .' + this.words_tray_class).insertAdjacentHTML('beforeend', add_code);
        });
        document.querySelectorAll('#' + this.working_root_id + " ." + this.word_class).forEach(elm => {
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
                this.speakInEng(ev.target.dataset.text);
                return false;
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
                if (ev.target.classList.contains('holding') == false) {
                    return;
                }
                let x = ev.touches[0].clientX - this.prevX;
                let y = ev.touches[0].clientY - this.prevY;
                this.prevX = ev.touches[0].clientX;
                this.prevY = ev.touches[0].clientY;
                var style = getComputedStyle(ev.target);
                ev.target.style.top = (parseInt(style.top, 10) + y) + "px";
                ev.target.style.left = (parseInt(style.left, 10) + x) + "px";
            });
            elm.addEventListener('touchend', ev => {
                ev.target.classList.remove("holding");
            });
        });
        document.querySelector('#' + this.working_root_id + ' .' + this.statemenmt_tray_class).addEventListener('click', e => {
            let cr = e.target.getBoundingClientRect();

            let tlx = window.pageXOffset + cr.left;
            let tly = window.pageYOffset + cr.top;
            let brx = tlx + cr.width;
            let bry = tly + cr.height;

            let words_on_tray = [];
            document.querySelectorAll('#' + this.working_root_id + ' .' + this.words_tray_class + ' .' + this.word_class).forEach(word => {
                let cr = word.getBoundingClientRect();
                let left = window.pageXOffset + cr.left;
                let top = window.pageYOffset + cr.top;
                if (bry < top) {
                    return;
                }
                words_on_tray.push(word);
            });
            let statement = '';
            words_on_tray.sort( function(x, y){
                if( x.getBoundingClientRect().left < y.getBoundingClientRect().left) return -1;
                if( y.getBoundingClientRect().left < x.getBoundingClientRect().left) return 1;
                return 0;
            });
            words_on_tray.forEach(word => {
                statement = statement + word.dataset.text + ' ';
            });
            statement = statement + "。";

            this.speakInEng(statement);
        });
    }
}

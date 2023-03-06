class ChatTable {
    constructor(working_root_id, cols) {
        let CHAT_TABLE_CLASS   = 'chat_table';
        this.cols = cols;

        let hd = '<tr>';
        this.cols.forEach( (col) => {
            hd += '<th>' + col + '</th>';
        });
        hd += '</tr>';
        document.querySelector('#' + working_root_id).insertAdjacentHTML('beforeend', '<table class="' + CHAT_TABLE_CLASS + '">' + hd + '</table>');
        this.elm = document.querySelector('#' + working_root_id + " ." + CHAT_TABLE_CLASS);
    }

    appendRow(col, msg) {
        let r = this.elm.insertRow(-1);
        this.cols.forEach( (col) => {
            r.insertCell();
        });
        r.cells[col].innerHTML = msg;
    }
}

class ChatWithChatGPT {
    constructor(working_root_id, playpause_button_id, speak_func) {
        this.speak_func = speak_func;
        this.chat_table = new ChatTable(working_root_id, ["Yours", "Others"]);
        this.ai = new SpeechRecognizer('recpause_button', (text) => {
            this.chat(text);
        });
    }

    chat(statement) {
        this.chat_table.appendRow(0, statement);
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                'model':'gpt-3.5-turbo',
                'messages' : [
                    {'role':'system', 'content': 'Please answer easily like to child.'},
                    {'role':'user', 'content': statement }
                ]
            })
        })
        .then(res => {
            return res.json();
        })
        .then(eng => {
            var text = eng.choices[0].message.content
            this.chat_table.appendRow(1, text);
            this.speak_func(text);
            return;
        });
    }
}

class WordsReorderer {
    constructor() {
    }
    exec(words) {
        let ret = [];
        let subject = [];
        let verbs = [];

        words.forEach( word => {
            if ( word.dataset.posi.includes('v') ) {
                verbs.push(word.dataset.text);
            } else if (verbs.length==0) {
                ret.push(word.dataset.text + 'は');
            } else {
                ret.push(word.dataset.text);
            }
        });
        verbs.reverse().forEach( verb => {
            ret.push(verb);
        });
        return ret;
    }
}

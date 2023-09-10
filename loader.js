export const Loader = 
{
    hasLoaded: false,

    content: '',
    n_paragraphs: 0,

    /** @type {((data:any)=>void)[]} */
    callbackList: [],
    /** @type {any[]} */
    callbackData: [],
};

document.addEventListener('DOMContentLoaded', function(){
    fetch('/information.txt').then(function(res){
        res.text().then(function(information){
            Loader['hasLoaded'] = true;
            Loader['content'] = information;
            Loader['n_paragraphs'] = information.match(/[^\r]/g).join('').split('\n\n').length;
            Loader['callbackList'].forEach((v,i) => v(Loader['callbackData'][i]));
        });
    });
});
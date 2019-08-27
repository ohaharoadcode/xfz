function Message() {
    this._init();
}

Message.prototype = {
    '_init': function () {
        this.div = document.createElement('div');
        var div_style = {
            'height': '40px',
            'display': 'none',
            'background-color': 'skyblue',
            'color':'red',
            'font-size':'17px',
            'position': 'fixed',
            'top': '0',
            'z-index': '9999',
            'border-radius': '5px',
            'padding': '10px 60px',
            'line-height': '30px',
            'text-align': 'center',
        };
        $(this.div).css(div_style);
        document.body.appendChild(this.div);
    },
    'show_hide': function (message) {
        this.div.innerText = message;
        var left = (document.body.clientWidth - $(this.div).outerWidth())/2;
        $(this.div).css('left',left+'px');
        var self =this;
        $(this.div).slideDown();
        setTimeout(function () {
            $(self.div).slideUp()
        }, 3000)
    },
};
$(function () {
    post_message = new Message();
});
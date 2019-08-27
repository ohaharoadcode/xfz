function Comment() {
    this._init()
}

Comment.prototype = {
    _init:function () {
        this.textarea = $('.comment-write .login[name="comment"]');//评论输入框对象
        this.pub_btn = $('.comment .comment-write .btn button');  //发布按钮对象
        this.tips = $('.comment-write .tips');//评论框获取焦点时，在评论框上方显示：回复。。。。
        this.comment_to = -1;
        this.comment_to_author = '';
        this.master = '';
        this.news_author = $('.article-detail  .author .name').text();
        this.news_author_id =  $('.article-detail .author .name').attr('uu');
        console.log(this.news_author_id);
        this.news = $('.article-detail').attr('uu')
    },
    reply_click:function () {
        //点击评论中的回复按钮
        var reply_btn = $('.comment-list .reply a');
        var self = this;
        reply_btn.click(function () {
            var author = $(this).parent().parent().find('.author-name')
            self.comment_to_author = author.find('.author-author').text();
            var left = self.textarea[0].offsetLeft;
            var top = self.textarea[0].offsetTop;
            window.scrollTo(left,top-150);
            self.comment_to = author.attr('uu');
            self.master = author.attr('master');
            self.textarea.focus();
        })
    },
    textarea_focus:function () {
        var self = this;
        self.textarea.focus(function () {
            if(self.comment_to_author === ''){
                self.comment_to_author = self.news_author;
                self.comment_to = self.news_author_id;
            }
            self.tips.text('回复 '+self.comment_to_author+'：')
        });
        self.textarea.focusout(function () {
            if (self.textarea.val() ===''){
                self.comment_to_author = '';
                self.comment_to = -1 ;
                self.master= '';
                self.tips.text('');
            }
        })
    },
    pub_click:function(){
        var self = this;
        self.pub_btn.click(function () {
            var text = self.textarea.val();
            if (text === ''){
                alert('评论不能为空！')
            }else {
                xfz_ajax.post({
                    url:'/news/pub_comment',
                    data:{
                        content:text,
                        comment_to:self.comment_to,
                        news:self.news,
                        master:self.master,
                    },
                    success:function (result) {
                        console.log(result);
                        window.location.reload()
                    }
                })
            }
        })
    },
    run:function () {
        this.reply_click();
        this.textarea_focus();
        this.pub_click();
    }
};
$(function () {
    var comm = new Comment();
    comm.run()

})
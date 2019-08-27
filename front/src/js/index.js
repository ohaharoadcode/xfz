function News_manage() {

    //定义过滤器，datevalue是过滤器前面的数据，和django过滤器一样
    template.defaults.imports.timesince = function (dateValue) {
        var date = new Date(dateValue);
        var date_ts = date.getTime();  //将时间转换为毫秒
        var now_ts = (new Date()).getTime();  //将此时（now）时间转换为毫秒
        var delta = (now_ts - date_ts) / 1000;  //得到发布时间与现在时间差（秒）
        if (delta < 60) {
            return '刚刚'
        } else if (delta < 60 * 60) {
            return parseInt(delta / 60) + '分钟前'
        } else if (delta < 60 * 60 * 24) {
            return parseInt(delta / (60 * 60)) + '小时前'
        } else if (delta < 60 * 60 * 24 * 3) {
            return parseInt(delta / (60 * 60 * 24)) + '天前'
        } else {
            var y = date.getFullYear();
            var m = date.getMonth();
            var d = date.getDay();
            // var h = date.getHours();
            // var minu = date.getSeconds()
            return y + '-' + m + '-' + d
        }
        return dateValue
    }

    this._init();

}

News_manage.prototype = {
    _init: function () {
        this.load_click_num = 0;
        this.load_btn = $('#load-more');
        this.categories = $('.list-tag li a');
    },
    load_more_click: function () {
        var self = this;
        self.load_btn.click(function () {
            self.load_click_num++;
            var category_id = $('.list-tag li a.active').attr('id');
            xfz_ajax.get({
                url: '/news/get_more_news/' + self.load_click_num,
                data: {
                    // p: self.load_click_num,
                    category_id: category_id
                },
                success: function (result) {
                    if (result.code === 200) {
                        if (result.data) {
                            var html = template('load-news', result.data);
                            self.load_btn.text('查看更多');
                            self.load_btn.css('cursor', 'pointer');
                            $('.news-content').append(html);
                        } else {
                            self.load_btn.text('没有更多了。。。');
                            self.load_btn.css('cursor', 'not-allowed');
                        }

                    }
                }
            })
        })
    },
    change_category_click: function () {
        var self = this;
        self.categories.click(function () {
            self.load_click_num = 0;
            var category_id = $(this).attr('id');
            xfz_ajax.get({
                url: '/news/get_more_news/' + self.load_click_num,
                data: {
                    category_id: category_id,
                },
                success: function (result) {
                    if (result.code === 200) {
                        if (result.data) {
                            var html = template('load-news', result.data);
                            self.load_btn.text('查看更多');
                            self.load_btn.css('cursor', 'pointer');
                            $('.news-content').html(html);
                        } else {
                            $('.news-content').html('');
                            self.load_btn.text('没有更多了。。。');
                            self.load_btn.css('cursor', 'not-allowed');
                        }

                    }
                },
            })
        })
    },
    run: function () {
        this.change_category_click();
        this.load_more_click();
    }
};


$(function () {

    //轮播图
    var mySwiper = new Swiper('.swiper-container', {
        // direction: 'vertical', // 垂直切换选项
        loop: true, // 循环模式选项
        autoplay:true,

        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
        },

        // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

    });
    $('.swiper-container').hover(function () {
        mySwiper.autoplay.stop()
    },function () {
        mySwiper.autoplay.start()
    });


    //新闻内容栏
    var list_tag = $('.list-tag');

    //上滚时，分类栏固定
    $(window).scroll(function () {
        if (($(window).scrollTop() >= 380)) {
            list_tag.css({'position': 'fixed', 'top': '70px'})
        } else {
            list_tag.css('position', 'static')
        }

    });

    //点击分类，变色
    list_tag.find('a').click(function () {
        list_tag.find('a').removeClass();
        this.setAttribute('class', 'active')
    });

    //点击加载更多进行加载
    var load_more = new News_manage();
    load_more.run();


});





$(function () {
    //侧边栏上

    var qm_list = $('.qm-list').children();
    var weixin_share = qm_list.find('.weixin');
    var weibo_share = qm_list.find('.weibo');
    //鼠标进入
    qm_list.mouseenter(function () {
        var list_title = $(this).children().eq(0);
        var share = $(this).find('.share');
        list_title.css('color', '#f7766a')
        share.css('display', 'block')
    });
    //鼠标离开
    qm_list.mouseleave(function () {
        var list_title = $(this).children().eq(0);
        var share = $(this).find('.share');
        list_title.css('color', '#555555');
        share.css('display', 'none');
    });
    //更改分享图片
    weixin_share.mouseenter(function () {
        $(this).children().eq(0).attr('href', '#icon-weixin1')
    });
    weixin_share.mouseleave(function () {
        $(this).children().eq(0).attr('href', '#icon-weixin-')
    });
    weibo_share.mouseenter(function () {
        $(this).children().eq(0).attr({'href': '#icon-weibo'})
    });
    weibo_share.mouseleave(function () {
        $(this).children().eq(0).attr('href', '#icon-logo-weibo')
    });
    //单击收放消息详情
    qm_list.click(function () {
        var content = $(this).find('.list-content');
        if (content.hasClass('content-open')) {
            content.removeClass('content-open');
            content.slideUp(200)
        } else {
            content.addClass('content-open');
            content.slideDown(200)
        }
    })


    //侧边栏作者
    var author_li = $('.side-author .author-list').children();
    //鼠标进入，姓名变红
    author_li.mouseenter(function () {
        $(this).find('.name').css('color', 'red');
    })

    //鼠标离开，恢复
    author_li.mouseleave(function () {
        $(this).find('.name').css('color', 'black');
    })


})





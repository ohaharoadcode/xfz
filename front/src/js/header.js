$(function () {
    var course_li = $('.header .nav .header-li');
    var course_menu = $('.header .course-menu');
    var service_menu = $('.header .service-menu');
    $(course_li[1]).mouseenter(function () {
        course_menu.css('display', 'block')
    });
    $(course_li[1]).mouseleave(function () {
        course_menu.css('display', 'none')
    });
    $(course_li[2]).mouseenter(function () {
        service_menu.css('display', 'block')
    });
    $(course_li[2]).mouseleave(function () {
        service_menu.css('display', 'none')
    });

    //  弹出/关闭登录注册页面
    var login_div = $('.header .right .login');
    var auth_model = $('.auth');
    var auth_close = $('.auth .register .close');

    // login_div.click(function () {
    //     auth_model.css('display','block');
    //     $('body').css('overflow','hidden')
    // });


});
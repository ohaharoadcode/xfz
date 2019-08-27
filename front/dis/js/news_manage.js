//获取当前url中的参数,即将url中？后面的的参数放入到一个字典中
function GetRequest() {

    var url = location.search; //获取url中"?"符后的字串

    var theRequest = new Object();

    if (url.indexOf("?") != -1) {

        var str = url.substr(1);

        strs = str.split("&");

        for (var i = 0; i < strs.length; i++) {

            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);

        }

    }

    return theRequest;

}

$(function () {

    //点击删除键
    var delete_btn = $('.box-footer .delete-category');
    delete_btn.click(function () {
        var checkboxes = $('table .select');
        var select_id = '';
        checkboxes.each(function () {
            if ($(this).prop('checked')) {
                select_id += $(this).attr('value') + '$';
            }
        });
        swal({
            title: '是否删除？',
            text: '删除后数据将无法恢复！',
            icon: 'warning',
            buttons: {
                cancel: {
                    visible: true,
                    text: '取消',
                    value: false,
                },
                confirm: {
                    text: '确认',
                    closeModal: false
                }
            }
        }).then(function (value) {
            if (value) {
                var search = $('input[name="search"]').val();
                var current_page = $('ul.pagination .disabled').text();
                var page_num = $('#example1_length select').val();
                xfz_ajax.post({
                    'url': '/cms/delete_news/',
                    'data': {
                        select_id: select_id,
                        search: search,
                        current_page: current_page,
                        page_num: page_num
                    },
                    'success': function (result) {
                        let code = result.code;
                        if (code === 200) {
                            swal({
                                title: result.message,
                                timer: 1500,
                                icon: 'success'
                            }).then(() => {
                                window.location.reload();
                            });
                        } else {
                            swal({
                                title: result.message,
                                timer: 1000,
                                icon: 'error',
                            })
                        }
                    }
                })

            }
        })
    })

    //select 每页显示条数按钮
    var num_page_select = $('#example1_length select');
    var a_tag = $('#example1_length a');
    num_page_select.change(function () {
        // a_tag.attr('href','&num='+$(this).val())
        var search = $('input[name="search"]').val();
        // var current_page = $('ul.pagination .disabled').text();
        var page_num = $('#example1_length select').val();
        var start_date = $('#start_date').val();
        var end_date = $('#end_date').val();
        var category = $('#category').val();
        // var current_url = window.location.href;
        a_tag.attr('href', '?search=' + search + '&page_num=' + page_num + '&start_date=' + start_date + '&end_date=' + end_date + '&category=' + category);
    });


    //日历
    laydate.render({
        elem: '#start_date',
    });

//时间格式化方法
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    var time2 = new Date().format("yyyy-MM-dd");
    laydate.render({
        elem: '#end_date',
    });

    //清空搜索内容
    var clear_btn = $('#clear-btn');
    clear_btn.click(function () {
        $('input[name="search"]').val('');
        $('#start_date').val('');
        $('#end_date').val('');
        $('#category').val('0');
    })
});






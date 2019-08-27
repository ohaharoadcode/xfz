$(function () {
    var btn = $('.box-footer button');
    btn.click(function (e) {
        e.preventDefault();
        var telephone = $('#telephone').val();
        if (!telephone) {
            swal({
                icon: 'error',
                title: '手机号不能为空',
            })
        } else {
            var groups = $('form .checkbox input:checked');
            if (!groups.length) {
                swal({
                    icon: 'error',
                    title: '未选取分组'
                })
            } else {
                var groups_id = new Array(groups.length);
                groups.each(function (index) {
                    groups_id[index] = $(this).val()
                    }
                );
                console.log(groups_id);
                xfz_ajax.post({
                    url:'/cms/add_group/',
                    data:{
                        telephone:telephone,
                        groups_id:groups_id,
                    },
                    success:function (result) {
                        swal({
                            title:result.message,
                            icon:'success'
                        })
                    }
                })
            }

        }
    })
})
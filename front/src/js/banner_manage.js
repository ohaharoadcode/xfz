function BannerManage(options) {
    this._init(options);
    this.run()
}

BannerManage.prototype = {
    _init: function (options) {
        this.wrapper = $(options.wrapper);
        this.add_btn = $(options.add_btn);
        this.delete_btn = $('.delete_banner');
        this.submit_btn = $('.submit-btn')

    },
    run: function () {
        this.add_banner();
        this.delete_banner();
        this.upload_img();
        this.submit();
    },
    add_banner: function () {
        var self = this;
        self.add_btn.click(function () {
            var html = template('banner-card', 0);
            self.wrapper.prepend(html);

        })
    },
    delete_banner: function () {
        var self = this;
        this.wrapper.on('click', '.delete_banner', function () {
            var per_banner = $(this).parents('.per-banner');
            var id = per_banner.attr('name');
            if (!id) {
                per_banner.remove()
            } else {
                swal({
                    icon: 'warning',
                    title: '确定删除？',
                    text: '删除后将无法恢复！',
                    buttons: ['取消', '删除'],
                    dangerMode: true
                }).then(function (value) {
                    if (value) {
                        xfz_ajax.post({
                            url: '/cms/delete_banner/',
                            data: {
                                id: id,
                            },
                            success: function (result) {
                                var code = result.code;
                                if (code === 200) {
                                    per_banner.remove();
                                    swal({
                                        icon: 'success',
                                        title: '删除成功',
                                        timer: 1500
                                    })
                                } else {
                                    swal({
                                        icon: 'error',
                                        title: '该轮播图不存在！',
                                        timer: 2000
                                    })
                                }
                            }
                        })
                    }
                })
            }
        });

        // self.delete_btn.click()
    },
    upload_img: function () {
        var self = this;
        this.wrapper.on('change', 'input[name="banner_img"]', function () {
            var file = this.files[0];
            var formdata = new FormData();
            formdata.append('banner_img', file);
            xfz_ajax.post({
                'url': '/cms/banner_img_upload/',
                'data': formdata,
                'processData': false,  //使用当前的数据，不用序列化
                'contentType': false,//
                'success': function (result) {
                    var code = result.code;
                    if (code === 200) {
                        $(this).parent().find('img').attr('src', result.data.url)
                    }
                }.bind(this)
            })
        })
    },
    submit: function () {
        var self = this;
        self.wrapper.on('click', '.submit-btn', function () {
            var per_banner = $(this).parents('.per-banner');
            var img_url = per_banner.find('.banner-img-wrapper img').attr('src');
            var priority = per_banner.find('.banner_priority').val();
            var link_url = per_banner.find('.banner_url').val();
            var id = per_banner.attr('name');
            xfz_ajax.post({
                url: '/cms/banner_manage',
                data: {
                    id: id,
                    banner_img: img_url,
                    link_url: link_url,
                    priority: priority
                },
                success: function (result) {
                    var code = result.code;
                    if (code === 200) {
                        var name = result.data.name;
                        swal({
                            icon: 'success',
                            title: result.message,
                            timer: 1000
                        }).then(function () {
                            per_banner.attr('name', name);
                            per_banner.find('.position priority').text('优先级为' + priority)
                        });

                    } else {
                        swal({
                            icon: 'error',
                            title: result.message,
                            timer: 1500
                        })
                    }
                }

            })
        })
    }
};
$(function () {
    var m_banner = new BannerManage({
        add_btn: '.add_banner',
        wrapper: '.banner-wrapper',
    });
});
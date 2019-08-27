function Log(options) {
    this._init(options);
}

Log.prototype = {
    '_init': function (options) {
        this.auth = options.auth;
        this.login = this.auth.find('.login');
        this.register = this.auth.find('.register');
        this.close = this.register.find('.close');
        this.display_btn = options.display_btn;
    },
    'display_init': function () {
        var self = this;
        this.auth.find('error').each(function () {
            this.innerText = '';
        });
        this.auth.find('.verify-div img').each(function () {
            self.change_verifycode(this)
        })
    },
    'displayclick': function () {
        var self = this;
        this.display_btn.click(function () {
            self.display_init();
            self.auth.css('display', 'block');
            $('body').css('overflow', 'hidden')
        })
    },
    'closeclick': function () {
        var self = this;
        this.close.click(function () {
            self.auth.css('display', 'none');
            //将显示错误的信息清空
            $('body').css('overflow', 'visible')
        })
    },
    'change_verifycode': function (verify_img) {
        var img_src = verify_img.getAttribute('src');
        img_src = img_src.split('?')[0];
        verify_img.setAttribute('src', img_src + '?' + Math.random())
    },
    'verifycode_click': function () {
        var self = this;
        var verify_img = this.auth.find('.verify-div img');
        verify_img.click(function () {
            self.change_verifycode(this)
        })
    },
    'login_tran_data': function () {
        var self = this;
        var login_sumbit = this.login.find('#login-submit');
        login_sumbit.click(function (event) {
            event.preventDefault();
            //将错误信息清空
            $('.auth .login .error').each(function () {
                this.innerText = ''
            });
            var telephone = $('#login_telephone').val();
            var password = $('#login_password').val();
            var img_verify = $('#login_img_verify').val();
            var remember = $('#login_remember').prop('checked');//选中返回true，未选中返回false
            xfz_ajax.post({
                'url': '/account/login',
                'data': {
                    'telephone': telephone,
                    'password': password,
                    'img_verify': img_verify,
                    'remember': remember,
                },
                'success': function (result) {
                    var code = result['code'];
                    var message = result['message'];
                    var error_data = result['data'];
                    if (code == 200) {
                        window.location.reload();
                    } else {
                        post_message.show_hide(message);
                        if (error_data) {
                            for (var key in error_data) {
                                $('#login_' + key).next()[0].innerText = error_data[key][0];
                            }
                        }
                    }

                },
                'fail': function (error) {
                    console.log('error', error);
                }
            })
        })
    },
    'register_tran_data': function () {
        var self = this;
        var register_btn = self.register.find('#register-submit');
        register_btn.click(function (event) {
            event.preventDefault();
            self.register.find('.error').each(function () {
                this.innerText = '';
            });
            var username = $('#register_username').val();
            var telephone = $('#register_telephone').val();
            var password1 = $('#register_password1').val();
            var password2 = $('#register_password2').val();
            var email = $('#register_email').val();
            var img_verify = $('#register_img_verify').val();
            xfz_ajax.post({
                'url': '/account/register',
                'data': {
                    'username': username,
                    'telephone': telephone,
                    'password1': password1,
                    'password2': password2,
                    'email': email,
                    'img_verify': img_verify
                },
                'success': function (result) {
                    var code = result.code;
                    var error_data = result.data;
                    if (code == 200) {
                        post_message.show_hide(result.message);
                        window.location.reload()
                    } else {
                        post_message.show_hide(result.message);
                        for (var key in error_data) {
                            $('#register_' + key).next()[0].innerText = error_data[key][0];

                        }
                    }
                }
            })

        })

    },
    'run': function () {
        this.login_tran_data();
        this.register_tran_data();
        this.verifycode_click();
        this.displayclick();
        this.closeclick();
    }
};
$(function () {
    log = new Log({'auth': $('.auth'), 'display_btn': $('.header .right .login')});
    log.run();
});
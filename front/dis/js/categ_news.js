function AddEditEvent() {
    this.run();
}

AddEditEvent.prototype = {
    'EditBtnClick': function () {
        //点击编辑按钮时，将分类名加载到模态框的输入框中
        let edit_btn = $('table td button');
        this.eidt_id = '';
        let self = this;
        edit_btn.click(function () {
            const cate_name = $(this).parent().prev().text();
            self.eidt_id = $(this).parent().attr('class').split('_')[1];
            self.edit_modal(cate_name, self.eidt_id)
        });
    },
    'edit_modal': function (cate_name, edit_id) {
        swal({
            title: '修改分类',
            text: '请修改类名',
            content: {
                element: 'input',
                attributes: {
                    value: cate_name
                }
            },
            buttons: {
                cancel: {
                    text: '取消',
                    visible: true,
                    closeModal: true,
                },
                confirm: {
                    text: '确认修改',
                    closeModal: false
                }
            }
        }).then((value) => {
            //因为对于input框的默认值函数会传递为空字符，所以此处就不传递，而是自己获取
            let name = $('input.swal-content__input').val();
            if (value === '') {
                if (name === cate_name) {
                    swal({
                        title: '请键入新的类名！',
                        icon: 'warning',
                        timer: 1000
                    }).then(() => {
                        this.edit_modal(cate_name,edit_id)
                    })
                } else {
                    swal({
                        title: '类名不能为空！',
                        icon: 'warning',
                        timer: 1000
                    }).then(() => {
                        this.edit_modal(cate_name, edit_id)
                    })
                }
            }
            else if (value) {
                xfz_ajax.post({
                    'url': '/cms/edit_categnews/',
                    'data': {
                        'pk': edit_id,
                        'name': value
                    },
                    'success': function (result) {
                        let code = result.code;
                        if (code === 200) {
                            swal({
                                title: result.message,
                                icon: 'success',
                                timer: 1000
                            }).then(() => {
                                window.location.reload()
                            })
                        } else {
                            swal({
                                title: result.message,
                                icon: 'error',
                                timer: 1000
                            }).then(() => {
                                this.edit_modal(value, edit_id)
                            })
                        }
                    }.bind(this)
                })
            }

        })
    },
    'add_modal': function () {
        let title='添加分类';
        let text = '请输入新类名（批量添加请以空格分开）';
        swal({
            title:title ,
            text:text ,
            content: 'input',
            buttons: {
                cancel: {
                    text: '取消',
                    visible: true,
                    closeModal: true,
                },
                confirm: {
                    text: '确认添加',
                    closeModal: false
                }
            }
        }).then((value) => {
            if (value === '') {
                swal({
                    title: '请键入新的类名！',
                    icon: 'warning',
                    timer: 1000
                }).then(() => {
                    this.add_modal()
                })
            }
            else if (value) {
                xfz_ajax.post({
                    'url': '/cms/add_categnews/',
                    'data': {
                        'name': value
                    },
                    'success': function (result) {
                        let code = result.code;
                        if (code === 200) {
                            swal({
                                title: result.message,
                                icon: 'success',
                                timer: 1000
                            }).then(() => {
                                window.location.reload()
                            })
                        } else {
                            swal({
                                title: result.message,
                                icon: 'error',
                                timer: 1000
                            }).then(() => {
                                this.add_modal();
                            })
                        }
                    }.bind(this)
                })
            }

        })
    },
    'AddBtnClick': function () {
        let add_modal_btn = $('.box .add-category-btn');
        var self=this;
        add_modal_btn.click(function () {
            self.add_modal();
        })
    },
    'run': function () {
        this.EditBtnClick();
        this.AddBtnClick();
    },
};


$(function () {
    //将搜索框内容加载到搜索按钮的a标签中
    var search = $('.box .search');
    var search_btn = $('.box .search-btn');
    search.focusout(function () {
        search_btn.attr('href', '?search=' + $(this).val())
    });

    //点击删除分类确认键
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
        }).then(value => {
            if (value) {
                xfz_ajax.post({
                    'url': '/cms/delete_categnews/',
                    'data': {'select_id': select_id},
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


    //编辑分类
    add_edit_event = new AddEditEvent();

});







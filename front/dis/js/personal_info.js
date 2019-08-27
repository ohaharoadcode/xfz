//将base64转换为文件,截取图片后会用到
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
}

$(function () {
    var up_thumbnail = $('#up_thumbnail');  //获取上传文件的input对象

    //选中文件后，触发change事件：
    up_thumbnail.change(function () {
        var file = this.files[0];  //获取图片对象

        //读取文件对象，弹出模态框，对图片进行预览
        filereader = new FileReader();
        filereader.readAsDataURL(file);
        filereader.onload = function () {
            //弹出模态框，模态框的内容content是一个img标签，classname是source-img，这个标签cropper要用到
            swal({
                content: {
                    element: 'img',
                    attributes: {
                        src: this.result,//此处的this.result就是读取的文件数据，放至img标签，进行预览
                        width: 400,
                        className: 'source-img'
                    }
                },
                buttons: {
                    cancel: { //取消按钮，点击后为null
                        text: '取消',
                        closeModal: true,
                        visible: true,
                    },
                    confirm: {   //确认按钮，点击后会返回true
                        text: '上传',
                        closeModal: false,
                        className: 'cut-btn',
                    }
                },
            }).then((value) => {  //点击按钮后，会将按钮的值传递给value，根据value进行下一步动作
                if (value) {  //如果value为真
                    if ($(".source-img").attr("src") == null) {  //图像框中没有图像，弹出error模态框，1秒后自动关闭
                        swal({
                            icon: 'error',
                            title: '没有图片上传',
                            timer: 1000
                        });
                    } else {  //图像框中有图像
                        var cas = $('.source-img').cropper('getCroppedCanvas');// 获取被裁剪后的canvas
                        var base64 = cas.toDataURL('image/jpeg'); // 转换为base64
                        var picture = dataURLtoFile(base64, file.name);//转换为图片对象

                        //使用ajax对图片文件进行传递
                        // 注意：这里的xfz_ajax是我自己写的对一个小封装，实际上就是自动将csrf_token的值加载到header，直接使用jq的ajax也可以实现。只不过多个步骤而已。
                        var formdata = new FormData();
                        formdata.append('thumbnail', picture); //前面为主键名，后面为文件对象
                        //使用jq的ajax时，post请求一定要记着带上csrf_token的值。
                        xfz_ajax.post({
                            'url': '/cms/upto_thumbnail/',
                            'data': formdata,
                            'processData': false,  //使用当前的数据，不用序列化
                            'contentType': false,//
                            'success': function (result) {
                                if (result.code === 200) {  //这个后台返回的code信息是我自定义的，上传成功会返回一个resul字典，其中一个key为code，成功值为200
                                    swal({   //上传成功，显示success模态框。其显示的信息为返回的信息。1.5秒后自动关闭模态框，并自动刷新网页
                                        title: result.message,
                                        icon: 'success',
                                        timer: 1500
                                    }).then(() => {
                                        window.location.reload()
                                    })
                                } else {
                                    swal({  //上传失败，弹出失败模态框
                                        title: result.message,
                                        icon: 'error',
                                        timer: 1500
                                    })
                                }
                            }
                        })

                    }

                }
            });

            //在生成模态框之后（只有生成了模态框，才有cropper需要的img标签）时候对cropper进行初始化。
            $('.source-img').cropper({
                aspectRatio: 1,// 默认比例
                preview: '#previewImg',// 预览视图，可以不要，如果想要预览，可以将一个img标签的id放进来
                guides: true, // 裁剪框的虚线(九宫格)
                autoCropArea: 0.8, // 0-1之间的数值，定义自动剪裁区域的大小，默认0.8
                movable: false, // 是否允许移动图片
                dragCrop: true, // 是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域
                movable: true, // 是否允许移动剪裁框
                resizable: true, // 是否允许改变裁剪框的
                zoomable: false, // 是否允许缩放图片大小
                mouseWheelZoom: false, // 是否允许通过鼠标滚轮来缩放图片
                touchDragZoom: true, // 是否允许通过触摸移动来缩放图片
                rotatable: false, // 是否允许旋转图片
                crop: function (e) {
                }
            });
        };
    });
});
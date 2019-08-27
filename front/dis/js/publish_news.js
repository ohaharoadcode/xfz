function UploadFiles(options) {
    this._init(options);
}

UploadFiles.prototype = {
    '_init': function (options) {
        this.file_input = options.file_input;
        this.fileType = {
            'img': ['jpg', 'jpeg', 'png', 'tif', 'gif', 'bmp'],
            'video': ['mp4', 'mkv']
        }
    },
    'listen_change': function () {
        var self = this;
        var url_input = $('#thumbnail-url');
        this.file_input.change(function () {
            var file = this.files[0];//获取文件对象
            if (!self.verify_type(file.name, 'img')) {
                console.log('3-1');
                swal({
                    icon: 'error',
                    text: '提交的文件格式不正确！',
                    time: 1500
                })
            } else {
                formdata = new FormData();
                formdata.append('thumbnail', file);
                xfz_ajax.post({
                    'url': '/cms/upload_newsthumbnail',
                    'data': formdata,
                    'processData': false,
                    'contentType': false,
                    'success': function (result) {
                        var code = result.code;
                        if (code === 200) {
                            swal({
                                icon: 'success',
                                text: '上传成功',
                                timer: 1000,
                            }).then(() => {
                                url_input.val(result.data.url)
                            })
                        }
                    }
                })

            }


        })
    },
    'verify_type': function (filename, type) {
        var filenameArray = filename.split('.');
        var fileType = filenameArray[filenameArray.length - 1];
        console.log('2');
        return this.fileType[type].includes(fileType)

    },
    'run': function () {
        this.listen_change()
    }
};


function WEditor(options) {
    this._init(options);
    this.submit();
}

WEditor.prototype = {
    '_init': function (options) {
        this.submit_btn = options.submit_btn;
        this.E = window.wangEditor;
        this.editor = new this.E(options.editor);
        this.config = this.editor.customConfig;

        //配置编辑器
        //静态配置：编辑器的图标、csrf_token的配置等
        this.static_config();
        //事件配置：编辑器中图片上传、focus、onchange事件等
        this.event_config();

        this.editor.create();

        //编辑新闻时，将原新闻内容填入编辑器
        this.get_news_content();
        this.E.fullscreen.init(options.editor);  //可以全屏


    },
    'static_config': function () {
        //menus(数组) 配置菜单，默认为所有都开启
        this.config.menus = [
    'head',  // 标题
    'bold',  // 粗体
    'fontSize',  // 字号
    'fontName',  // 字体
    'italic',  // 斜体
    'underline',  // 下划线
    'strikeThrough',  // 删除线
    'foreColor',  // 文字颜色
    'backColor',  // 背景颜色
    'link',  // 插入链接
    'list',  // 列表
    'justify',  // 对齐方式
    'quote',  // 引用
    'emoticon',  // 表情
    'image',  // 插入图片
    'table',  // 表格
    'video',  // 插入视频
    'code',  // 插入代码
    'undo',  // 撤销
    'redo',  // 重复
];
        this.config.debug = location.href.indexOf('wangeditor_debug_mode=1') > 0; //是否开启调试模式，显示错误信息，=1为开启
        this.config.onchangeTimeout = 10 //设置onchange 触发延迟，默认为200ms
        this.config.zIndex = 100; //配置z-index，默认为10000
        this.config.pasteFilterStyle = true//粘贴外部复制文本时，默认不粘贴样式,自动过滤掉样式
        this.config.pasteIgnoreImg = false;//粘贴外部文本时，此处设置为不过滤图片
        // colors（数组）配置字体颜色和背景颜色（同时配置）

        //配置字体（数组）
        this.config.fontNames = [
            '宋体',
            '微软雅黑',
            'Arial',
            'Tahoma',
            'Verdana',
            '黑体',
            '楷体',
        ];
        this.config.uploadImgServer = '/cms/news_picture'; //上传图片到自己服务器url
        this.config.uploadImgMaxSize = 3 * 1024 * 1024;  //设置图片上传最大 此处为3M
        this.config.uploadImgMaxLength = 5;  //限制一次上传图片的数量，默认为10000张
        this.config.uploadImgTimeout = 10000;//设置图片上传超时时间 10s
        this.config.uploadFileName = 'news_picture';
        //配置本页面的csrf_token
        var token = $('input[name = "csrfmiddlewaretoken"]').val();
        this.config.uploadImgHeaders = {
            'X-CSRFToken': token
        }
        //还可以配置表情、语言等，详情看文档
    },
    'event_config': function () {
        var self = this;
        //配置onfocus事件,获取焦点时，如果里面的文字为“请输入新闻内容”，则自动清空。
        this.config.onfocus = function () {
            if (self.editor.txt.html() === '<p style="color: #999999">请输入新闻内容</p><p><br></p>') {
                self.editor.txt.clear();
            }
        };

        //配置图片上传到自己服务器
        this.config.uploadImgHooks = {
            before: function (xhr, editor, files) {

                // editor.customConfig.uploadImgParams = {
                //                 //
                //                 //     // 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
                //                 //     // 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
                //                 //     'csrfmiddlewaretoken': token
                //                 // };
                // console.log(token);
                // 图片上传之前触发
                // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
                // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
                // return {
                //     prevent: true,
                //     msg: '放弃上传'
                // }
            },
            //图片上传成功后，将地址插入到img中
            customInsert: function (insertImg, result, editor) {
                // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

                // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                var url = result.data.url;
                img = insertImg(url)

                // result 必须是一个 JSON 格式字符串！！！否则报错
            }
        }

    },
    'submit':function () {
        var self = this;
        self.submit_btn.click(function (event) {
            console.log('in');
            event.preventDefault();
            var title = $('#news-title').val();
            var desc =$('#news-desc').val();
            var category = $('#news-category').val();
            var thumbnail = $('#thumbnail-url').val();
            var content = self.editor.txt.html();
            var pk = $('#edit_news_id').val()|false;
            xfz_ajax.post({
                url:'/cms/publish_news/',
                data:{
                    title:title,
                    desc:desc,
                    category_id:category,
                    thumbnail:thumbnail,
                    content:content,
                    pk:pk,
                },
                success:function (result) {
                    var code = result.code;
                    console.log(result.data);
                    if(code === 200){
                        swal({
                            icon:'success',
                            title:'发布成功',
                            timer:1000,
                        }).then(() => {
                            window.location.href=result.data.url
                        })
                    }else {
                        console.log(result.data);
                    }
                }
            })
        })
    },
    'get_news_content':function () {
        var content = $('#edit_news_content').val();
        if (content){
            this.editor.txt.html(content)
        }
    }

};


$(function () {
    uploadThumbnail = new UploadFiles({'file_input': $('#thumbnail-file')});
    uploadThumbnail.run();

    w_editor = new WEditor({'editor': '#editor','submit_btn':$('#submit')});

});
//加载包
var gulp = require('gulp');
var rename = require('gulp-rename');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
babel = require('gulp-babel');
// var imagemin = require("gulp-imagemin");
var cache = require('gulp-cache');
var bs = require('browser-sync').create();
var sass = require("gulp-sass");


//文件路径
var src_path = {
    'css': './src/css/',
    'js': './src/js/',
    'img': './src/img/',
    'html':'./templates/**/'
};

//定义存储文件路径
var dis_path = {
    'css': './dis/css/',
    'js': './dis/js/',
    'img': './dis/img/',
};

//定义css任务，此处的css文件全都在css文件夹根目录下，如果想对css文件夹下的所有文件都使用，要用循环
//若某个文件夹下好多文件，那么watch监听时需要一一列举，可以目录写成json格式（例如src.source.*.js）。
// 通过引入“fs”插件，用fs.freaddirSync()方法去读路径。循环即可，此处的实现纯属写js代码。
gulp.task('css', done => {
    gulp.src(src_path.css + '*.scss')
        .pipe(sass().on("error",sass.logError)) //将sass转换为css,on后面是打印错误
        .pipe(cssnano())
        .pipe(rename({'suffix': '.min'}))
        .pipe(gulp.dest(dis_path.css))
        .pipe(bs.stream());//重新加载
    done();
});

//定义压缩js任务
gulp.task('js', done => {
    gulp.src(src_path.js + '*.js')
        .pipe(uglify())
        .pipe(rename({'suffix': '.min'}))
        .pipe(gulp.dest(dis_path.js))
        .pipe(bs.stream());
    done();
});

//压缩图片  出了点问题，暂时禁用
/*
gulp.task('img',done=>{
    gulp.src(src_path.img + '*.*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(dis_path.img ));
    done();
});
*/


// 刷新html的改变

gulp.task('html',done=>{
    gulp.src(src_path.html+'*.html')
        .pipe(bs.stream())
});

//定义监听文件修改的事件
gulp.task('watch', done => {
    gulp.watch(src_path.css + '*.scss', gulp.series('css'));
    gulp.watch(src_path.js + '*.js', gulp.series('js'));
    gulp.watch(src_path.html + '*.html',gulp.series('html'));
    done();
});

//创建服务器，代码更新后刷新浏览器。初始化browser-sync任务
gulp.task('bs', done => {
    bs.init({
        'server': {
            'baseDir': './',
        },
    });
    done();
});

//创建一个默认任务，监听文件改变
//如果任务名为default时，运行该任务时，可以省略任务名，直接使用gulp即可。
// gulp.task('default', gulp.series(['bs', 'watch']));
gulp.task('default',gulp.series('watch'));


















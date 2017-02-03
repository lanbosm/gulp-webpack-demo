/**
 Gulpfile for gulp-webpack-demo
 created by lanbo
 dev：开发环境； pro:生产环境；webpack：webpack环境；

 参考 http://www.imooc.com/article/7221#child_1_1
      https://www.npmjs.com/package/gulp-webpack
 */
"use strict";

const gulp = require('gulp'),
    gutil = require('gulp-util'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    chsiRev = require('gulp-chsi-rev'),
    prefix = require('gulp-prefix'),
    fileinclude = require('gulp-file-include'),
    clean = require('gulp-clean'),
    spriter = require('gulp-css-spriter'),
    base64 = require('gulp-css-base64');




const gulpwebpack = require('gulp-webpack');  //gulp版webpack
const webpack = require('webpack');          //原生的webpack

const webpackConfig=require("./webpack.config.js");
const webpackConfigPro=require("./webpack.production.config.js");



var browserSync = require('browser-sync').create();

var host = {
    path: 'dist/',
    port: 3000,
    html: 'index.html'
};


gulp.task('clean', function () {
    console.log("清理dist目录完成...");
    // return 清楚干净后的数据流(Stream)
    return gulp.src('./dist', {read: false})
        .pipe(clean({force: true}));
});


//将第三方css拷贝目录
gulp.task('copy:css', function () {
    return  gulp.src(['src/css/**/*.css']).pipe(gulp.dest('dist/css'));
});

//将图片拷贝到目标目录
gulp.task('copy:images', function () {
    return  gulp.src(['src/images/**/*']).pipe(gulp.dest('dist/images'));
});

// 合并lib文件 通常是第三方库
gulp.task('copy:lib',function(){

    gulp.src(['**/*.js','!vue/*.js'],{
        cwd:'./lib/'
    }).pipe(rename(function (path) {
        path.dirname = "./";             //以根目录方式输出
    })).pipe(gulp.dest('./dist/js'));

    gulp.src(['**/*.css'],{             //抓取时候会存在子目录
        cwd:'./lib/'
    }).pipe(rename(function (path) {
        path.dirname = "./";             //以根目录方式输出
    })).pipe(gulp.dest('./dist/css/'));

    //针对vue
    gulp.src(['vue/vue.min.js','vue-router/vue-router.min.js'],{
        cwd:'./lib/'
    }).pipe(concat('vue.min.js')).pipe(gulp.dest('./dist/js'));

})

//copy
gulp.task('copy',['copy:css','copy:images','copy:lib'],function() {
    console.log("copy资源完成...");
    return gulp.src('./dist');
});

//压缩合并css, css中既有自己写的.less, 也有引入第三方库的.css css处理
gulp.task('lessmin', function (done) {
    //修改源码
    gulp.src(['src/css/main.less'])  //main 是主入口
        .pipe(less())
        //这里可以加css sprite 让每一个css合并为一个雪碧图
        //.pipe(spriter({}))
        .pipe(concat('style.min.css'))
        .pipe(cssmin({"keepBreaks":true}))
        .pipe(gulp.dest('dist/css/'))
        .on('end', done);
});

//用于在html文件中直接include文件 html处理
gulp.task('fileinclude', function (done) {

    gulp.src(['src/app/*.html'])
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(gulp.dest('dist/app'))
        .on('end', done);
});

//引用webpack对js进行操作 js处理
gulp.task("build-js", function(done) {
    //  console.log("正在打包Js..."); //官方写法版
    // var devconfig = Object.create(webpackConfig);
    // var devCompiler = webpack(devconfig);  //在编译一次？
    // devCompiler.run(function(err, stats) {
    //     if(err) throw new gutil.PluginError("webpack:build-js", err);
    //     gutil.log("[webpack:build-js]", stats.toString({
    //         colors: true
    //     }));
    //     console.log("打包完成...");
    //     done();
    // });

    console.log("正在打包Js...");   //插件版
    return   gulp.src('src/js/main.js')  //这里src只是装样子 如果想有效请使用vinyl-named
        .pipe(  gulpwebpack( webpackConfig , null, function(err, stats) {
            /* Use stats to do more things if needed */
            if(err) throw new gutil.PluginError("webpack:build-js", err);
                gutil.log("[webpack:build-js]", stats.toString({
                    colors: true
                }));
        }))
        .pipe(gulp.dest('dist/js/'))
        .on('end', function(){
            console.log("打包完成...");
        });
});

//准备发布的js打包
gulp.task('rev:js', function (done) {
    console.log("正在打包Js...");
    return   gulp.src('src/js/main.js')  //这里src只是装样子 如果想有效请使用vinyl-named
        .pipe(gulpwebpack( webpackConfigPro ))
        .pipe(gulp.dest('dist/js/'))
        .on('end', function(){
            console.log("打包完成...");
        });
});

//准备发布的css打包
gulp.task('rev:css', function (done) {

    //也许还有其他的外部css?
    gulp.src(['src/css/*.css'])
        .pipe(gulp.dest('dist/css/'));

    return gulp.src(['src/css/main.less'])  //main 是主入口
        .pipe(less())
        //这里可以加css sprite 让每一个css合并为一个雪碧图
        //.pipe(spriter({}))
        .pipe(concat('style.min.css'))
       // .pipe(cssmin({"keepBreaks":true}))
        .pipe(chsiRev())
        .pipe(gulp.dest('dist/css/'));


});

//准备发布的html打包
gulp.task('rev:html', function (done) {
    //也许会用到cdn
   // var prefixUrl = "http://mydomain.com/assets";
   // .pipe(prefix(prefixUrl, null, '{{'))
    return gulp.src(['src/app/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))

        .pipe(chsiRev())
        .pipe(gulp.dest('dist/app'))
});


//雪碧图操作，应该先拷贝图片并压缩合并css
gulp.task('sprite', ['copy:images', 'lessmin'], function (done) {
    var timestamp = +new Date();
    gulp.src('dist/css/style.min.css')
        .pipe(spriter({
            spriteSheet: 'dist/images/spritesheet' + timestamp + '.png',
            pathToSpriteSheetFromCSS: '../images/spritesheet' + timestamp + '.png',
            spritesmithOptions: {
                padding: 10
            }
        }))
        .pipe(base64())
        .pipe(cssmin())
        .pipe(gulp.dest('dist/css'))
        .on('end', done);
});


//监听事件
gulp.task('watch', function (done) {
    //分别对html css js 处理 本来写**/* 其他文件也会多余操作
    gulp.watch('src/**/*.html', ['fileinclude']);

    gulp.watch('src/**/*.less', ['lessmin']);

    gulp.watch('src/**/*.js', ['build-js']);

});


// 静态服务器 + 监听 css/html 文件
gulp.task('web', function() {
    console.log('browser------------');
    browserSync.init({
        server: {
            baseDir: host.path,
            directory: true
        },
        port: host.port
    });
    //每次dist文件发生变化 自动刷新游览器
    gulp.watch(['dist/**/*.css','dist/**/*.html','dist/**/*.js']).on('change', function(){
        browserSync.reload();
       // console.log("change");
    });
});



//webpack服务器 万物皆模块（js） 没配好 css html 要手动刷新
gulp.task('webpack-dev',function(){
    var webpackConfigDev=require("./webpack.config.js"); //这里没仔细配置 以后再说
    var WebpackDevServer = require("webpack-dev-server");
    //new HotMiddleware(compiler);                   //中间件 还没添加
    var config = Object.create(webpackConfigDev);
    config.devtool = "eval";
    config.debug = true;

    for(var i in config.entry){ //给每个多入口添加监听器
      //  console.log(i);
       config.entry[i].unshift("webpack-dev-server/client?http://localhost:"+host.port+"/", "webpack/hot/dev-server");
    }

    config.plugins.push(new webpack.HotModuleReplacementPlugin()); //添加热刷新功能

    //tips
    //这两项配置原本是在webpack.config.dev.js里边配置，可是通过gulp启动devserver，那种配置无效，只能在此处写入
    //官网的解释是webpack-dev-server没有权限读取webpack的配置

    var compiler = webpack(config);
    var server = new WebpackDevServer(compiler, {
        contentBase: "./",
        publicPath: "/dist/js/",
        inline:true,
        hot: true,
        compress: false,
        stats: { colors: true }
    });
    server.listen( host.port, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        // gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
        console.log("listen successful , port at 3000");
    });

    // server.close();
});




gulp.task('default',function(){
    console.log("如果开发请输入gulp dev 生产请输入gulp pro");
});


//静态服务器开发 适合布局
gulp.task('dev', ['clean'],function(){           //不能同时进行 所以很多start
    gulp.start('copy',function(){
        gulp.start('fileinclude','lessmin','build-js',function(){
            gulp.start( 'web','watch');
        });
    });
});


//生产最后的dist 适合发布 压缩
gulp.task('pro', ['clean'],function(){
    //也许你需要cdn!
    gulp.start('copy',function(){
        gulp.start('rev:html','rev:css','rev:js',function(){ //少个图片压缩
            console.log("生成终了..");
        });
    });
});


//webpack服务器开发 适合 js编译
gulp.task('webpackdev', ['clean'],function(){
     gulp.start('copy','fileinclude','lessmin','webpack-dev');
});


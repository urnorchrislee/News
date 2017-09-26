const express=require('express');
const static=require('express-static');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const bodyParser=require('body-parser');
const multer=require('multer');
const consolidate=require('consolidate');
const mysql=require('mysql');

//连接池
const db=mysql.createPool({host: 'localhost', user: 'root', password: '111111', database: 'blog'});

var server=express();
server.listen(8080);

//1.解析cookie
server.use(cookieParser('sdfasl43kjoifguokn4lkhoifo4k3'));

//2.使用session
server.use(cookieSession({name: 'sess_id', keys: ['tom', 'kitty', 'rose'], maxAge: 20*3600*1000}));

//3.post数据
server.use(bodyParser.urlencoded({extended: false}));
server.use(multer({dest: './www/upload'}).any());

//4.配置模板引擎
//输出什么东西
server.set('view engine', 'html');
//模板文件放在哪儿
server.set('views', './views');
//哪种模板引擎
server.engine('html', consolidate.ejs);

//接收用户请求
server.get('/', (req, res, next)=>{
    db.query('select * from `blog`.`banner_table`', function(err, data){
        if(err){
            res.status(500).send('连接数据库失败').end();
        } else{
            res.banners = data;
        }
        next();
    })
});
server.get('/', (req, res, next)=>{
    db.query('select title,summary from `blog`.`article_table`', function(err, data){
        if(err){
            res.status(500).send('连接数据库失败').end();
        } else {
            res.articles = data;
        }
        next();
    })
})
server.get('/', (req, res, next)=>{
    res.render('index.ejs', {banners: res.banners, articles: res.articles});
})

//4.static数据
server.use(static('./www'));

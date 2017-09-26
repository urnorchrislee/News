const express=require('express');
const static=require('express-static');
const cookieParser=require('cookie-parser');
const cookieSession=require('cookie-session');
const bodyParser=require('body-parser');
const multer=require('multer');
const consolidate=require('consolidate');
const mysql=require('mysql');
const common = require('./libs/common');

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
    db.query('select ID,title,summary from `blog`.`article_table`', function(err, data){
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

server.get('/article', (req, res)=>{
    if(req.query.id){

        if(req.query.act == 'like'){
            // 点赞
            db.query(`UPDATE article_table SET n_like=n_like+1 WHERE ID=${req.query.id}`, (err, data)=>{
                if(err){
                    res.status(500).send('连接数据库失败').end();
                } else{
                    // 显示文章
                    db.query(`SELECT * FROM article_table WHERE ID=${req.query.id}`, (err, data)=>{
                        if(err){
                            res.status(500).send('连接数据库失败').end();
                        }else{
                            if(data.length == 0){
                                res.status(404).send('您访问的页面不存在').end();
                            } else{
                                // console.log(data[0]);
                                var articleData = data[0];
                                articleData.sDate = common.time2date(articleData.post_time);
                                articleData.content = articleData.content.replace(/^/gm, '<p>').replace(/$/gm, '</p>');

                                res.render('conText.ejs', {article_table: articleData})
                            }
                        }
                    })
                }
            })
        } else{
            // 显示文章
            db.query(`SELECT * FROM article_table WHERE ID=${req.query.id}`, (err, data)=>{
                if(err){
                    res.status(500).send('连接数据库失败').end();
                }else{
                    if(data.length == 0){
                        res.status(404).send('您访问的页面不存在').end();
                    } else{
                        // console.log(data[0]);
                        var articleData = data[0];
                        articleData.sDate = common.time2date(articleData.post_time);
                        articleData.content = articleData.content.replace(/^/gm, '<p>').replace(/$/gm, '</p>');

                        res.render('conText.ejs', {article_table: articleData})
                    }
                }
            })
        }
    } else{
        res.status(404).send('您访问的页面不存在').end();
    }
})

server.get('/setting', (req, res)=>{
    res.render('mydoc.ejs', {})
})

server.get('/publish', (req, res)=>{
    db.query('insert into `blog`.`article_table` ( `author`, `author_src`, `title`, `post_time`, `content`, `summary`, `n_like`) values ( "王瑛琪", "images/nav4.png", "Happy New Year", "1506428949", "Content", "1506428949", "0")', (err, data)=>{
        if(err){
            res.status(500).send('连接数据库失败').end();
        } else{
            res.send('发布成功').end();
        }
    })
})

//4.static数据
server.use(static('./www'));

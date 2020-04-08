var express = require('express');
var globalConfig = require('./config');
var loader = require('./loader');

var app = new express();

app.use(express.static("./page/"));

app.post('/editEveryDay', loader.get("/editEveryDay"));
app.post('/editBlog', loader.get("/editBlog"));

app.get('/queryEveryDay', loader.get("/queryEveryDay"));
app.get('/queryBlogByPage', loader.get('/queryBlogByPage'));
app.get('/queryBlogCount', loader.get('/queryBlogCount'));
app.get('/queryBlogById', loader.get('/queryBlogById'));
app.get('/sendComment', loader.get('/sendComment'));
app.get('/queryRandomCode', loader.get('/queryRandomCode'));
app.get('/queryCommentsByBlogId', loader.get('/queryCommentsByBlogId'));
app.get('/queryAllBlog', loader.get('/queryAllBlog'));
app.get('/queryRandomTags', loader.get('/queryRandomTags'));
app.get('/queryHotBlog', loader.get('/queryHotBlog'));
app.get('/queryNewComment', loader.get('/queryNewComment'));
app.get('/queryByTag', loader.get('/queryByTag'));
app.get('/queryByTagCount', loader.get('/queryByTagCount'));
app.get('/queryLike', loader.get("/queryLike"));
app.get('/queryByLikeCount', loader.get("/queryByLikeCount"));

app.listen(globalConfig['port'], function () {
    console.log("服务器已启动");
});


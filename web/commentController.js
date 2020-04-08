var url = require('url');
var path = new Map();
var commentDao = require('../dao/commentDao');
var respUtil = require('../util/respUtil');
var timeUtile = require('../util/timeUtil');
var captcha = require("svg-captcha");

function sendComment(request, response) {
    var params = url.parse(request.url, true).query;
    var blogId = parseInt(params.blogId);
    var parent = parseInt(params.parent);
    var parentName = params.parentName;
    var userName = params.userName;
    var content = params.content;
    var email = params.email;
    var ctime = timeUtile.getNow();
    var utime = timeUtile.getNow();
    commentDao.insertComment(blogId, parent, parentName, userName, content, email, ctime, utime, function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "评论成功", null));
        response.end();
    })
}
path.set('/sendComment', sendComment);

function queryRandomCode(request, response) {
    var img = captcha.create({fontSize: 50, width: 80, height: 35});
    response.writeHead(200);
    response.write(respUtil.writeResult("succes", "评论成功", img));
    response.end();
}
path.set('/queryRandomCode', queryRandomCode);

function queryCommentsByBlogId(request, response) {
    var params = url.parse(request.url, true).query;
    commentDao.queryCommentByBlogId(parseInt(params.blogId), function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("succes", "请求成功", result));
        response.end();
    })
}
path.set('/queryCommentsByBlogId', queryCommentsByBlogId);

function queryNewComment (request, response) {
    commentDao.queryNewComment(5, function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("succes", "请求成功", result));
        response.end();
    })
}
path.set('/queryNewComment', queryNewComment);


module.exports.path = path;

var blogDao = require('../dao/blogDao');
var timeUtil = require('../util/timeUtil');
var respUtil = require('../util/respUtil');
var tagDao = require('../dao/tagDao');
var tagBlogMappingDao = require('../dao/tagBlogMappingDao');
var url = require('url');

var path = new Map();

function editBlog (request, response) {
    var params = url.parse(request.url, true).query;
    var tags = params.tags.replace(/ /g, "").replace("，", ",");
    request.on('data', function (data) {
        blogDao.insertBlog(params.title, data.toString(), tags, 0, timeUtil.getNow(), timeUtil.getNow(), function (result) {
            response.writeHead(200);
            response.write(respUtil.writeResult('success', "添加成功", null));
            response.end();
            var blogId = result.insertId;
            var tagList = tags.split(',');
            for (var i = 0; i < tagList.length; i ++) {
                if (tagList[i] == '') {
                    continue;
                }
                queryTag(tagList[i], blogId);
            }
        })
    })
}
path.set('/editBlog', editBlog);

function queryTag (tag, blogId) {
    tagDao.queryTag(tag, function (result) {
        if (result == null || result.length == 0) {
            insertTag(tag, blogId);
        }else {
            insertTagBlog(result[0].id, blogId);
        }
    })
}

function insertTag (tag, blogId) {
    tagDao.insertTag(tag, timeUtil.getNow(), timeUtil.getNow(), function (result) {
        insertTagBlog(result.insertId, blogId);
    })
}

function insertTagBlog (tagId, blogId) {
    tagBlogMappingDao.insertTagBlogMapping(tagId, blogId, timeUtil.getNow(), timeUtil.getNow(), function (result) {})
}

function queryBlogByPage (request, response) {
    var params = url.parse(request.url, true).query;
    blogDao.queryBlogByPage(parseInt(params.page), parseInt(params.pageSize), function (result) {
        for (var i = 0 ; i < result.length; i ++) {
            result[i].content = result[i].content.replace(/<img[\w\W]*">/, '');
            result[i].content = result[i].content.replace(/<[\w\W]{1,5}>/g, '');
            result[i].content = result[i].content.substring(0, 200);
        }
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    })
}
path.set('/queryBlogByPage', queryBlogByPage);

function queryBlogCount (request, response) {
    blogDao.queryBlogCount(function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result))
        response.end();
    })
}
path.set('/queryBlogCount', queryBlogCount);

function queryBlogById (request, response) {
    var params = url.parse(request.url, true).query;
    blogDao.queryBlogById(parseInt(params.blogId), function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result))
        response.end();
        blogDao.addViews(parseInt(params.blogId), function (result) {})
    })
}
path.set('/queryBlogById', queryBlogById);

function queryAllBlog (request, response) {
    blogDao.queryAllBlog(function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result))
        response.end();
    })
}
path.set('/queryAllBlog', queryAllBlog);

function queryHotBlog (request, response) {
    blogDao.queryHotBlog(5, function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result))
        response.end();
    })
}
path.set('/queryHotBlog', queryHotBlog);

function queryLike (request, response) {
    var params = url.parse(request.url, true).query;
    var like = "%" +params.like + "%";
    blogDao.queryLikeBlog(like, parseInt(params.page), parseInt(params.pageSize), function (result) {
        for (var i = 0 ; i < result.length; i ++) {
            result[i].content = result[i].content.replace(/<img[\w\W]*">/, '');
            result[i].content = result[i].content.replace(/<[\w\W]{1,5}/g, '');
            result[i].content = result[i].content.substring(0, 200);
        }
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result))
        response.end();
    })
}
path.set('/queryLike', queryLike);

function queryByLikeCount (request, response) {
    var params = url.parse(request.url, true).query;
    var like = "%" +params.like + "%";
    blogDao.queryByLikeCount(like, function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result))
        response.end();
    })
}
path.set('/queryByLikeCount', queryByLikeCount);

module.exports.path = path;
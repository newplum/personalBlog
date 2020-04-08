var dbUtil = require('./dbutil');

function  insertComment (blogId, parent, parentName, userName, comments, email, ctime, utime, success) {
    var insertSql = 'insert into comments (blog_id, parent, parent_name, user_name, comments, email, ctime, utime) value (?, ?, ?, ?, ?, ?, ?, ?);';
    var params = [blogId, parent, parentName, userName, comments, email, ctime, utime];
    var connection = dbUtil.createConnection();
    connection.connect();
    connection.query(insertSql, params, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log(error);
        }
    })
    connection.end();
}

function  queryCommentByBlogId (blogId, success) {
    var querySql = 'select * from comments where blog_id = ?;';
    var params = [blogId];
    var connection = dbUtil.createConnection();
    connection.connect();
    connection.query(querySql, params, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log(error);
        }
    })
    connection.end();
}

function  queryNewComment (size, success) {
    var querySql = 'select * from comments order by id desc limit ?;';
    var params = [size];
    var connection = dbUtil.createConnection();
    connection.connect();
    connection.query(querySql, params, function (error, result) {
        if (error == null) {
            success(result);
        }else {
            console.log(error);
        }
    })
    connection.end();
}


module.exports.insertComment = insertComment;
module.exports.queryCommentByBlogId = queryCommentByBlogId;
module.exports.queryNewComment = queryNewComment;
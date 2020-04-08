var blog_detail = new Vue({
    el: "#blog_detail",
    data: {
        title: '',
        content: '',
        ctime: '',
        tags: '',
        views: ''
    },
    computed: {

    },
    created () {
        var searchUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
        if (searchUrlParams == '') {
            return;
        }
        var blogId = -10;
        for (var i = 0; i < searchUrlParams.length; i ++) {
            if (searchUrlParams[i].split('=')[0] == "blogId") {
                try {
                    blogId = parseInt(searchUrlParams[i].split("=")[1]);
                }catch (e) {
                    console.log(e);
                }
            }
        }
        axios({
            method: 'get',
            url: '/queryBlogById?blogId=' + blogId,
        }).then(function (resp) {
            var result = resp.data.data[0];
            blog_detail.title = result.title;
            blog_detail.content = result.content;
            blog_detail.ctime = result.ctime;
            blog_detail.tags = result.tags;
            blog_detail.views = result.views;
        }).catch(function (resp) {
            console.log('请求失败');
        })

    }
});

var sendComment = new Vue({
    el: "#send_comment",
    data: {
        vcode: '',
        rightCode: ''
    },
    methods: {
        changeCode () {
            axios({
            method: 'get',
            url: '/queryRandomCode'
        }).then(function (resp) {
            sendComment.vcode = resp.data.data.data;
            sendComment.rightCode = resp.data.data.text;
        }).catch(function (resp) {
            console.log(resp)
        })
        }
    },
    computed: {
        sendComment: function () {
            return function () {
                var searchUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
                if (searchUrlParams == '') {
                    return;
                }
                var blogId = -10;
                for (var i = 0; i < searchUrlParams.length; i ++) {
                    if (searchUrlParams[i].split('=')[0] == "blogId") {
                        try {
                            blogId = parseInt(searchUrlParams[i].split("=")[1]);
                        }catch (e) {
                            console.log(e);
                        }
                    }
                }
                var code = document.getElementById('comment_code').value;
                var reply = document.getElementById("comment_reply").value;
                var replyName = document.getElementById("comment_reply_name").value;
                var name = document.getElementById("comment_name").value;
                var email = document.getElementById("comment_email").value;
                var content = document.getElementById("comment_content").value;
                if (code != this.rightCode) {
                    alert("验证码输入错误");
                    return;
                }
                if (name == '' || email == '' || content == "") {
                    alert("请补全评论信息");
                    return;
                }
                axios({
                    method: 'get',
                    url: '/sendComment?blogId=' + blogId + "&parent=" + reply + "&userName=" + name + "&email=" + email + "&content=" + content + "&parentName=" + replyName,
                }).then(function (resp) {
                    alert(resp.data.msg);
                }).catch(function (resp) {
                    console.log("提交失败");
                })
            };
        },
    },
    created () {
        this.changeCode();
    }
});

var blogComments = new Vue({
    el: '#blog_comments',
    data: {
        total: 1,
        comments: [
            {
                id: '',
                name: '',
                ctime: '',
                comments: '',
                options: ''
            }
        ]
    },
    methods: {
        reply (commentId, userName) {
            document.getElementById("comment_reply").value = commentId;
            document.getElementById("comment_reply_name").value = userName;
            location.href = "#send_comment";
        }
    },
    computed: {

    },
    created () {
        var searchUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
                if (searchUrlParams == '') {
                    return;
                }
                var blogId = -10;
                for (var i = 0; i < searchUrlParams.length; i ++) {
                    if (searchUrlParams[i].split('=')[0] == "blogId") {
                        try {
                            blogId = parseInt(searchUrlParams[i].split("=")[1]);
                        }catch (e) {
                            console.log(e);
                        }
                    }
                }
        axios({
            method: 'get',
            url: '/queryCommentsByBlogId?blogId=' + blogId
        }).then(function (resp) {
            blogComments.total = resp.data.data.length;
            blogComments.comments = resp.data.data;
            for (var i = 0 ; i < blogComments.comments.length; i ++) {
                if (blogComments.comments[i].parent > -1) {
                    blogComments.comments[i].options = "回复@" + blogComments.comments[i].parent_name;
                }
            }
        }).catch(function (resp) {
            console.log('请求失败');
        })
    }
});
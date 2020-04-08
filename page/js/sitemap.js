var blogList = new Vue({
    el: '#blog_list',
    data: {
        blogList: []
    },
    created() {
        axios({
            method: 'get',
            url: '/queryAllBlog'
        }).then(function (resp) {
            for (var i = 0; i < resp.data.data.length; i ++) {
                resp.data.data[i].link = "blog_detail.html?blogId=" + resp.data.data[i].id;
            }
            blogList.blogList = resp.data.data;
        })
    }
})
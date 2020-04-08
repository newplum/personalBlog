var randomTags = new Vue({
    el: '#random_tags',
    data: {
        tags: [],
    },
    computed: {
        randomColor: function () {
            return function () {
                var red = Math.random() * 255;
                var green = Math.random() * 255;
                var blue = Math.random() * 255;
                return "rgb(" + red + "," + green + ", " + blue + ")";
            }
        },
        randomSize: function () {
            return function () {
                var size = (Math.random() * 10 + 8) + "px";
                return size;
            }
        }
    },
    created() {
        axios({
            method: 'get',
            url: '/queryRandomTags'
        }).then(function (resp) {
            var result = [];
            for (var i = 0; i < resp.data.data.length; i ++) {
                result.push({text: resp.data.data[i].tag, link: "/?tag=" + resp.data.data[i].tag})
            }
            randomTags.tags = result;
        })
    }
});

var newHot = new Vue({
    el: '#new_hot',
    data: {
        hotList: []
    },
    created() {
        axios({
            method: 'get',
            url: '/queryHotBlog',
        }).then(function (resp) {
            var result = [];
            for (var i = 0; i < resp.data.data.length; i ++) {
                var temp = {};
                temp.title = resp.data.data[i].title;
                temp.link = '/blog_detail.html?blogId=' + resp.data.data[i].id;
                result.push(temp);
            }
            newHot.hotList = result;
        })
    }
})

var newComments = new Vue({
    el: '#new_comments',
    data: {
        commentList: []
    },
    created () {
        axios({
            method: 'get',
            url: '/queryNewComment'
        }).then(function (resp) {
            var result = [];
            for (var i = 0; i < resp.data.data.length; i ++) {
                var temp = {};
                temp.name = resp.data.data[i].user_name;
                temp.date = resp.data.data[i].ctime;
                temp.comment = resp.data.data[i].comments;
                result.push(temp);
            }
            newComments.commentList = result;
        })
    }
})
var everyDay = new Vue({
    el: '#every_day',
    data: {
        content: '',
    },
    computed: {
        getContent: function () {
            return this.content;
        }
    },
    created: function () {
        // 请求数据，给content赋值
        axios({
            method: 'get',
            url: '/queryEveryDay',
        }).then (function (resp) {
            everyDay.content = resp.data.data[0].content;
        }).catch(function () {
            console.log('请求失败');
        })
    }
});

var searchBar = new Vue({
    el: '#search_bar',
    data: {
        list: [],
        value: ''
    },
    methods: {
        searchLike (page, pageSize) {
            this.value = document.getElementById('input').value;
            var getBlogUrl = '/queryLike?like=' + searchBar.value + '&page=' + (page - 1) + '&pageSize=' + pageSize;
            var getCountUrl = '/queryByLikeCount?like=' + searchBar.value;
            getData(page, getBlogUrl, getCountUrl);
        }

    },
});

var articleList = new Vue({
    el: "#article_list",
    data: {
        page: 1,
        pageSize: 5,
        count: null,
        pageNumList: [],
        articleList: [
            {
                title: '',
                content: '',
                date: '',
                views: '',
                tags: '',
                id: '',
                link: ''
            }
        ]
    },
    methods: {
        jumpTo: function (page) {
            this.getPage(page, this.pageSize);
        },
        pageTool: function () {
            var nowPage = this.page;
            var pageSize = this.pageSize;
            var totalCount = this.count;
            var result = [];
            result.push({text: "<", page: 1});
            if (nowPage > 2) {
                result.push({text: nowPage - 2, page: nowPage - 2});
            }
            if (nowPage > 1) {
                result.push({text: nowPage - 1, page: nowPage - 1});
            }
            result.push({text: nowPage, page: nowPage});
            if (nowPage + 1 <= (totalCount + pageSize - 1) / pageSize) {
                result.push({text: nowPage + 1, page: nowPage + 1});
            }
            if (nowPage + 2 <= (totalCount + pageSize - 1) / pageSize) {
                result.push({text: nowPage + 2, page: nowPage + 2});
            }
            result.push({text: ">", page: parseInt((totalCount + pageSize - 1) / pageSize)});
            this.pageNumList = result;
        }
    },
    computed: {
        getPage: function () {
            return function (page, pageSize) {
                var searchUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
                var tag = '';
                for (var i = 0; i < searchUrlParams.length; i ++) {
                    if (searchUrlParams[i].split('=')[0] == "tag") {
                        try {
                            tag = searchUrlParams[i].split("=")[1];
                        }catch (e) {
                            console.log(e);
                        }
                    }
                }
                if (tag == '' && searchBar.value == '') {
                    var getBlogUrl = '/queryBlogByPage?page=' + (page - 1) + '&pageSize=' + pageSize;
                    var getCountUrl = '/queryBlogCount';
                    getData(page, getBlogUrl, getCountUrl);
                }else if (tag != '' && searchBar.value == '') {
                    var getBlogUrl = '/queryByTag?page=' + (page - 1) + '&pageSize=' + pageSize + '&tag=' + tag;
                    var getCountUrl = '/queryByTagCount?tag=' + tag;
                    getData(page, getBlogUrl, getCountUrl);
                }else {
                    searchBar.searchLike(page, pageSize);
                }
            }
        }
    },
    created () {
        this.getPage(this.page, this.pageSize)
    },
});


function getData (page, getBlogUrl, getCountUrl, ) {
    axios({
        method: 'get',
        url: getBlogUrl
    }).then(function (resp) {
        var result = resp.data.data;
        var list = [];
        for (var i = 0; i < result.length; i ++) {
            var temp = {};
            temp.title = result[i].title;
            temp.content = result[i].content;
            temp.date = result[i].ctime;
            temp.views = result[i].views;
            temp.tags = result[i].tags;
            temp.id = result[i].id;
            temp.link = '/blog_detail.html?blogId=' + result[i].id;
            list.push(temp);
        }
        articleList.articleList = list;
        articleList.page = page;
    });
    axios({
            method: 'get',
            url: getCountUrl
        }).then(function (resp) {
            articleList.count = resp.data.data[0].count;
            articleList.pageTool();
        }).catch(function (resp) {
            console.log("请求失败")
        })
}


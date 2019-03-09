<template>
    <div>
        <div class="done-header">
            <div class="done-title">
                <a href="" class="main-title">Node.js性能优化之CPU篇-test</a><br>
                <a href="" class="sub-title">发布成功，点击查看文章</a>
            </div>
            <ul class="article-share">
                <li class="weibo"><i class="fa fa-weibo"></i>微博</li>
                <li class="weixin"><i class="fa fa-wechat"></i>微信</li>
                <li class="link" ><i class="fa fa-link"></i>复制链接</li>
                <li @mouseleave="onMoreShareMouseLeave" @mouseenter="onMoreShareMouseEnter" class="more" title="">
                    <span class="more">更多分享
                        <div v-if="sharePopupVisible" class="popup">
                            <ul>
                                <li>
                                    <span class="social-item"><i class="social-icon-weixin"></i><span class="social-title">微信</span></span>
                                </li>
                                <li>
                                    <span class="social-item"><i class="social-icon-zone"></i><span class="social-title">QQ空间</span></span>
                                </li>
                                <li>
                                    <span class="social-item"><i class="social-icon-douban"></i><span class="social-title">豆瓣</span></span>
                                </li>
                                <li>
                                    <span class="social-item"><i class="social-icon-facebook"></i><span class="social-title">Facebook</span></span>
                                </li>
                                <li>
                                    <span class="social-item"><i class="social-icon-twitter"></i><span class="social-title">Twitter</span></span>
                                </li>
                                <li>
                                    <span class="social-item"><i class="social-icon-google"></i><span class="social-title">Google+</span></span>
                                </li>
                            </ul>
                        </div>
                    </span>
                </li>
            </ul>
        </div>
        <div class="done-header-sep"></div>
        <div class="done-box">
            <div class="done-search">
                <div class="done-search-input">
                    <i class="fa fa-search fa-2x"></i>
                    <input type="text" placeholder="搜索专题">
                </div>
                <div class="done-search-label">向专题投稿，让文章被更多人发现</div>
            </div>
            <div class="collection-box my-collection-box">
                <h3 class="collection-box-title my-collection-box-title">
                    我管理的专题<a class="my-collection-box-new" href="">新建</a>
                </h3>
                <ul class="collection-list">
                    <li :key="i" v-for="(c, i) in myCollections" class="collection-item">
                        <span class="my-collection-name">{{c.title}}</span>
                        <img :src="c.imgURL" />
                        <a href="">已收录</a>
                    </li>
                </ul>
            </div>
            <div class="collection-box my-collection-box">
                <h3 class="collection-box-title my-collection-box-title">
                    最近投稿
                </h3>
                <ul class="collection-list">
                    <li :key="i" v-for="(c, i) in recentPostCollections" class="collection-item">
                        <span class="my-collection-name">{{c.title}}</span>
                        <img :src="c.imgURL" />
                        <a href="">投稿</a>
                    </li>
                </ul>
            </div>
            <div class="collection-box" style="margin-bottom: 30px;">
                <h3 class="collection-box-title">推荐专题</h3>
                <ul class="collection-list">
                    <li :key="i" v-for="(c, i) in recommendCollections" class="collection-item" style="width: 50%;">
                        <img :src="c.imgURL" />
                        <a href="">投稿</a>
                        <span class="recommend-name">{{c.title}}<em>{{c.text}}</em></span>
                    </li>
                </ul>
            </div>
            <div class="no-more">没有更多了 </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            sharePopupVisible: false,
            myCollections: [
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                },
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                },
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                },
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                }
            ],
            recentPostCollections: [
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                },
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                },
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                },
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                }
            ],
            recommendCollections: [
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                    text: '216.8K篇文章，3987.0K人关注'    
                },
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                    text: '216.8K篇文章，3987.0K人关注'    
                },
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                    text: '216.8K篇文章，3987.0K人关注'    
                },
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                    text: '216.8K篇文章，3987.0K人关注'    
                },
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                    text: '216.8K篇文章，3987.0K人关注'    
                },
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                    text: '216.8K篇文章，3987.0K人关注'    
                },
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                    text: '216.8K篇文章，3987.0K人关注'    
                },
                {
                    title: 'Node.js全栈开发',
                    imgURL: 'https://upload.jianshu.io/collections/images/1699940/timg.jpeg',
                    text: '216.8K篇文章，3987.0K人关注'    
                },
            ]
        }
    },
    methods: {
        onMoreShareMouseLeave() {
            this.sharePopupVisible = false;
        },
        onMoreShareMouseEnter() {
            this.sharePopupVisible = true;
        }
    }
}
</script>

<style lang="scss" scoped>
    .done-close {
        position: fixed;
        top: 50px;
        right: 100px;
        font-size: 30px;
        font-weight: 700;
        padding: 5px;
        cursor: pointer;
    }

    .done-header {
        background-color: #f2f2f2;
        padding-bottom: 110px;
    }

    .done-title {
        padding: 80px 0 40px;
        padding-top: 115px;
        text-align: center;
    }

    .done-title .main-title {
        display: inline-block;
        height: 40px;
        font-size: 28px;
        font-weight: 500;
        color: #333;
        margin-bottom: 24px;
    }

    .done-title .sub-title {
        font-size: 16px;
        font-weight: 600;
        color: #42c02e;
        text-decoration: none;
    }

    .done-title .sub-title:hover {
        color: #3bab29;
    }

    .done-title .sub-title:before {
        content: "";
        display: inline-block;
        width: 18px;
        height: 10px;
        border: 3px solid #42c02e;
        border-width: 0 0 4px 4px;
        -webkit-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        transform: rotate(-45deg);
        -webkit-transition: 0s;
        -o-transition: 0s;
        transition: 0s;
        position: relative;
        bottom: 4px;
        right: 8px;
    }

    .article-share {
        text-align: center;
        color: #fff;
        font-size: 14px;
    }

    .article-share>li {
        display: inline-block;
        width: 124px;
        line-height: 38px;
        border-radius: 100px;
        margin: 0 15px;
        cursor: pointer;
        padding: 0;
        text-align: center;
    }

    .article-share>li i {
        margin-right: 5px;
    }

    .article-share li.weibo {
        background-color: #e05244;
    }

    .article-share li.weixin {
        background-color: #07b225;
    }

    .article-share li.sina {
        background-color: #e05244;
    }

    .article-share li.link {
        background-color: #3194d0;
    }

    .article-share li.more {
        background-color: #a7a7a7;
        position: relative;
    }

    .article-share li.more .popup {
        position: absolute;
        height: 100%;
        top: 38px;
        right: 0;
        z-index: 1;
    }

    .article-share .popup ul {
        width: 124px;
        right: -124px;
        top: 100%;
        z-index: 2;
        font-size: 14px;
        -webkit-box-shadow: 0 5px 10px rgba(0,0,0,.2);
        box-shadow: 0 5px 10px rgba(0,0,0,.2);
        list-style: none;
        background-color: #fff;
        color: #595959;
        border-radius: 6px;
    }

    .article-share .popup ul li {
        text-align: left;
        padding: 4px 12px;
        line-height: 24px;
        overflow: hidden;
        border-bottom: 1px solid #d9d9d9;
    }

    .article-share .popup ul li:hover {
        background-color: #666;
        color: #fff;
    }

    .article-share .popup ul li:first-child {
        border-radius: 4px 4px 0 0;
    }

    .article-share .popup ul li:last-child {
        border-radius: 0 0 4px 4px;
        border-bottom: 0;
    }

    .article-share .popup ul i {
        background-image: url(../../../images/social.png);
        background-size: 240px 20px;
        display: inline-block;
        vertical-align: top;
        margin: 3px 6px 0 0;
        padding: 0;
        width: 18px;
        height: 18px;
    }

    .social-icon-zone {
        background-position: -60px 0
    }

    .social-icon-twitter {
        background-position: -80px 0
    }

    .social-icon-facebook {
        background-position: -100px 0
    }

    .social-icon-google {
        background-position: -120px 0
    }

    .social-icon-douban {
        background-position: -140px 0
    }

    .social-item {
        display: inline-block;
    }

    .social-title {
        display: inline-block;
    }

    .done-header-sep {
        height: 40px;
        border-radius: 50% 50% 0 0/100% 100% 0 0;
        background-color: #fff;
        margin-top: -40px;
    }

    .done-box {
        margin: 40px auto 0;
        width: 700px;
        font-size: 14px;
    }

    .done-search {
        margin-bottom: 36px;
    }

    .done-search-label {
        font-size: 16px;
        font-weight: 500;
        line-height: 38px;
    }

    .done-search-input {
        float: right;
        border: 1px solid #d9d9d9;
        position: relative;
        width: 200px;
        height: 34px;
        border-radius: 17px;
        padding: 5px 20px 5px 30px;
        box-sizing: border-box;
    }

    .done-search-input i {
        position: absolute;
        left: 10px;
        top: 50%;
        margin-top: -8px;
        font-size: 16px;
        color: #ccc;
        height: 16px;
        line-height: 16px;
    }

    .fa-search:before {
        content: "\F002";
    }

    .done-search-input input {
        border: none;
        line-height: 24px;
        height: 24px;
        width: 100%;
        font-size: 14px;
        background-color: transparent;
    }

    .collection-box {
        margin-bottom: 50px;
        overflow: hidden;
    }

    .collection-box-title {
        margin-bottom: 0;
        height: 40px;
        line-height: 40px;
        padding: 0 6px 0 14px;
        background-color: #f2f2f2;
        font-size: 14px;
    }

    .my-collection-box-new {
        margin-left: 15px;
        color: #42c02e;
        text-decoration: none;
    }

    .collection-list {
        position: relative;
        min-height: 72px;
        overflow: hidden;
        border-left: 1px solid #f2f2f2;
    }

    .collection-item {
        float: left;
        width: 233px;
        border-right: 1px solid #f2f2f2;
        border-bottom: 1px solid #f2f2f2;
        position: relative;
        margin: 0;
        list-style-type: none;
        box-sizing: border-box;
    }

    .collection-item img {
        position: absolute;
        height: 40px;
        width: 40px;
        left: 15px;
        top: 15px;
        border-radius: 10%;
    }

    .collection-item .my-collection-name {
        display: block;
        font-weight: 700;
        color: #595959;
        width: 100%;
        padding: 0 60px 0 75px;
        line-height: 70px;
        overflow: hidden;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
    }

    .collection-item a {
        position: absolute;
        top: 24px;
        right: 15px;
        color: #42c02e;
    }

    .collection-item .recommend-name {
        display: block;
        padding: 18px 65px 16px;
        line-height: 1;
    }

    .collection-item .recommend-name em {
        font-weight: 400;
        font-style: normal;
        color: #999;
        display: block;
        margin-top: 8px;
        font-size: 12px;
    }

    .no-more {
        padding-bottom: 80px;
        text-align: center;
        color: rgba(0, 0, 0, 0.65);
    }
</style>


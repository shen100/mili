<template>
    <div class="main-box">
        <div class="major-box">
            <div class="user-info-block">
                <div class="user-info-block-avatar" :style="{'background-image': `url(${author.avatarURL})`}"></div>
                <div class="info-box">
                    <div class="top">
                        <h1 class="username">{{author.username}}<a href="/" target="_blank" class="rank">
                            <img src="https://b-gold-cdn.xitu.io/v3/static/img/lv-3.e108c68.svg"></a>
                        </h1>
                    </div>
                    <div class="position">
                        <svg width="21" height="18" viewBox="0 0 21 18" class="position-icon">
                            <g fill="none" fill-rule="evenodd">
                                <path fill="#72777B" d="M3 8.909V6.947a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1V8.92l-6 2.184v-.42c0-.436-.336-.79-.75-.79h-1.5c-.414 0-.75.354-.75.79v.409L3 8.909zm0 .7l6 2.184v.47c0 .436.336.79.75.79h1.5c.414 0 .75-.354.75-.79v-.46l6-2.183V16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.609zm6.75 1.075h1.5v1.58h-1.5v-1.58z"></path>
                                <path stroke="#72777B" d="M7.5 5.213V4A1.5 1.5 0 0 1 9 2.5h3A1.5 1.5 0 0 1 13.5 4v1.213"></path>
                            </g>
                        </svg>
                        <span class="content">
                            <span>{{author.job}}</span>
                            <span v-if="author.job && author.company" class="split"></span>
                            <span>{{author.company}}</span>
                        </span>
                    </div>
                    <div class="intro">
                        <svg width="21" height="18" viewBox="0 0 21 18" class="intro-icon">
                            <path fill="#72777B" fill-rule="evenodd" d="M4 4h13a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm9 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3 3a3 3 0 0 0-6 0h6zM5 7v1h4V7H5zm0 2.5v1h4v-1H5zM5 12v1h4v-1H5z"></path>
                        </svg>
                        <span class="content">{{author.introduce}}</span>
                    </div>
                </div>
                <div class="action-box">
                    <button class="follow-btn btn">关注</button>
                </div>
            </div>
            <div class="list-block">
                <div class="detail-list">
                    <div class="list-header">
                        <div class="header-content">
                            <router-link :to="`/users/${author.id}/articles`" class="nav-item">
                                <div class="item-title">文章</div>
                                <div class="item-count">1</div>
                            </router-link>
                            <router-link :to="`/users/${author.id}/boilings`" class="nav-item">
                                <div class="item-title">沸点</div>
                                <div class="item-count">1</div>
                            </router-link>
                            <div @click="onLikeClick" v-clickoutside="onClickOutSide" class="nav-item not-in-scroll-mode" :class="{open: likeClicked}">
                                <div class="item-title">赞</div>
                                <div class="item-count">1</div>
                                <div class="item-count">
                                    <i class="fa fa-caret-down"></i>
                                </div>
                                <div v-if="likeClicked" class="more-panel">
                                    <router-link :to="`/users/${author.id}/like/articles`" class="more-item">文章 0</router-link>
                                    <router-link :to="`/users/${author.id}/like/boilings`" class="more-item">沸点 1</router-link>
                                </div>
                            </div>
                            <router-link :to="`/users/${author.id}/follows`" class="nav-item">
                                <div class="item-title">关注</div>
                            </router-link>
                            <router-link :to="`/users/${author.id}/handbooks`" class="nav-item">
                                <div class="item-title">小册</div>
                            </router-link>
                        </div>
                    </div>
                    <div class="list-body">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
        <div class="minor-box">
            <div class="minor-area-box">
                <div class="user-stat-block">
                    <div class="block-title">个人成就</div>
                    <div class="block-body">
                        <div class="stat-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" class="zan-icon">
                                <g fill="none" fill-rule="evenodd" transform="translate(0 .57)">
                                    <ellipse cx="12.5" cy="12.57" fill="#fadcd6" rx="12.5" ry="12.57"></ellipse>
                                    <path fill="#e77c6a" d="M8.596 11.238V19H7.033C6.463 19 6 18.465 6 17.807v-5.282c0-.685.483-1.287 1.033-1.287h1.563zm4.275-4.156A1.284 1.284 0 0 1 14.156 6c.885.016 1.412.722 1.595 1.07.334.638.343 1.687.114 2.361-.207.61-.687 1.412-.687 1.412h3.596c.38 0 .733.178.969.488.239.317.318.728.21 1.102l-1.628 5.645a1.245 1.245 0 0 1-1.192.922h-7.068v-7.889c1.624-.336 2.623-2.866 2.806-4.029z"></path>
                                </g>
                            </svg>
                            <span class="content">获得点赞<span class="count">1,129</span></span>
                        </div>
                        <div class="stat-item">
                            <svg width="25" height="25" viewBox="0 0 25 25" class="article-view-icon">
                                <g fill="none" fill-rule="evenodd">
                                    <circle cx="12.5" cy="12.5" r="12.5" fill="#fadcd6"></circle>
                                    <path fill="#e77c6a" d="M4 12.5S6.917 7 12.75 7s8.75 5.5 8.75 5.5-2.917 5.5-8.75 5.5S4 12.5 4 12.5zm8.75 2.292c1.208 0 2.188-1.026 2.188-2.292 0-1.266-.98-2.292-2.188-2.292-1.208 0-2.188 1.026-2.188 2.292 0 1.266.98 2.292 2.188 2.292z"></path>
                                </g>
                            </svg>
                            <span class="content">文章被阅读<span class="count">46,499</span></span>
                        </div>
                        <div class="stat-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" class="stat-jp-icon">
                                <g fill="none" fill-rule="evenodd">
                                    <circle cx="12.5" cy="12.5" r="12.5" fill="#fadcd6"></circle> 
                                    <path fill="#e77c6a" d="M16.694 13.516l-3.719 3.055a1.1 1.1 0 0 1-1.412-.013l-2.77-2.362-3.597 2.437a.693.693 0 0 1-.895-.101.649.649 0 0 1-.008-.876l3.68-4.096a1.1 1.1 0 0 1 1.507-.122l2.653 2.135 2.248-2.4-1.34-1.358a.5.5 0 0 1 .327-.85l5.438-.313a.5.5 0 0 1 .528.533l-.368 5.449a.5.5 0 0 1-.855.317l-1.417-1.435z"></path>
                                </g>
                            </svg>
                            <span class="content">米粒值<span class="count">1,592</span></span>
                        </div>
                    </div>
                </div>
                <div class="follow-block">
                    <router-link :to="`/users/${author.id}/follows`" class="follow-item">
                        <div class="item-title">关注</div>
                        <div class="item-count">45</div>
                    </router-link>
                    <router-link :to="`/users/${author.id}/followers`" class="follow-item">
                        <div class="item-title">粉丝</div>
                        <div class="item-count">1,088</div>
                    </router-link>
                </div>
                <div class="more-block">
                    <router-link :to="`/users/${author.id}/followtags`" class="more-item">
                        <div class="item-title">收藏集</div>
                        <div class="item-count">0</div>
                    </router-link>
                    <router-link :to="`/users/${author.id}/followtags`" class="more-item">
                        <div class="item-title">关注标签</div>
                        <div class="item-count">18</div>
                    </router-link>
                    <div class="more-item">
                        <div class="item-title">加入于</div>
                        <div class="item-count">
                            <time class="time">2018-07-24</time>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            likeClicked: false,
            author: window.author,
            userID: window.userID || undefined,
        };
    },
    mounted() {
        this.$nextTick(() => {
            // this.$router.afterEach((to, from) => {
            //     this.likeClicked = false;   
            // });
        });
    },
    methods: {
        onLikeClick() {
            this.likeClicked = !this.likeClicked;
        },
        onClickOutSide() {
            this.likeClicked = false;  
        }
    },
    components: {

    }
}
</script>

<style>
.list-block {
    margin-top: 12px;
}

.list-header {
    position: relative;
    margin: 0;
    padding: 0;
    height: 50px;
    background-color: #fff;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #ebebeb;
    z-index: 100;
}

.list-header .header-content {
    display: flex;
    align-items: center;
    margin: 0 auto;
    height: 100%;
    max-width: 960px;
    white-space: nowrap;
}

.list-header .nav-item {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 90px;
    height: 100%;
    cursor: pointer;
    text-decoration: none;
}

.list-header .nav-item .item-title {
    font-size: 16px;
    font-weight: 500;
    color: #31445b;
}

.list-header .nav-item .item-count {
    margin-left: 5px;
    font-size: 15px;
    color: #b2bac2;
    line-height: 1;
}

.list-header .nav-item:not(.active):not(.open):hover .item-count, .list-header .nav-item:not(.active):not(.open):hover .item-title {
    opacity: .8;
}

.list-header .nav-item .more-panel {
    position: absolute;
    top: 100%;
    left: 50%;
    margin: 0 0 0 -45px;
    padding: 7px 0;
    width: 90px;
    background-color: #fff;
    border: 1px solid #f3f3f4;
    border-radius: 2px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .05);
    z-index: 1;
}

.list-header .nav-item .more-panel:after, .list-header .nav-item .more-panel:before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
}

.list-header .nav-item .more-panel:before {
    margin: -7px 0 0 -7px;
    border: 7px solid transparent;
    border-top: none;
    border-bottom: 7px solid #f3f3f4;
}

.list-header .nav-item .more-panel:after {
    margin: -6px 0 0 -6px;
    border: 6px solid transparent;
    border-top: none;
    border-bottom: 6px solid #fff;
}

.list-header .nav-item .more-panel .more-item {
    display: block;
    padding: 7px 0;
    font-size: 15px;
    text-align: center;
    color: #000;
}

.list-header .nav-item .more-panel .more-item:hover {
    background-color: #fcfcfc;
    text-decoration: none;
}

.post-list-box, .sub-header {
    background-color: #fff;
}

.list-body .sub-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 28px;
    height: 50px;
    white-space: nowrap;
    border-bottom: 1px solid rgba(230, 230, 231, .5);
}

.list-body .sub-header .sub-header-title {
    margin-right: 12px;
    font-size: 15px;
    font-weight: 600;
    color: #000;
}

.list-body .sub-header .sub-type-box {
    margin-left: auto;
}

.list-body .sub-header .sub-type-box .sub-type {
    position: relative;
    padding: 12px 0;
    font-size: 14px;
    color: #72777b;
}

.list-body .sub-header .sub-type-box .sub-type:not(:last-child) {
    margin-right: 24px;
}

.list-body .sub-header .sub-type-box .sub-type:not(:last-child):after {
    content: "";
    position: absolute;
    top: 50%;
    right: -14px;
    margin-top: -7px;
    width: 1px;
    height: 14px;
    background-color: #b2bac2;
    opacity: .5;
}

.list-body .sub-header .sub-type-box .sub-type.active {
    color: #000;
}

.list-body .sub-header .sub-type-box .sub-type:hover {
    opacity: .8;
    text-decoration: none;
}
</style>


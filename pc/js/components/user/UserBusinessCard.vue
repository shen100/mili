<template>
    <div ref="box" class="v-tooltip-avatar v-tooltip-wrap user-card-tooltip"
        :class="{'user-card-hidden': !isShowed}" :style="{top: top}">
        <div class="v-tooltip">
            <div v-if="user" class="tips-card">
                <div class="card-content">
                    <div class="summary">
                        <a target="_blank" :href="`/users/${userID}.html`" class="avatar"
                            :style="{'background-image': `url(${user.avatarURL})`}"></a>
                        <div class="name">
                            <a target="_blank" :href="`/users/${userID}.html`" class="nickname">{{user.username}}</a>
                        </div>
                        <div class="intro">{{user.introduce || '暂无简介'}}</div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="profile">
                        <div>
                            <span class="count">{{user.followCount || 0}}</span>
                            <span class="type">关注</span>
                        </div>
                        <div>
                            <span class="count">{{user.followerCount || 0}}</span>
                            <span class="type">粉丝</span>
                        </div>
                    </div>
                    <div class="social">
                        <FollowBtn ref="userFollowBtn" v-if="userID !== followerID" @followChange="onFollowChange"
                            :userID="userID" :followed="isFollowed" 
                            :followedStyle="followedStyle" :notFollowedStyle="notFollowedStyle" />
                    </div>
                </div>
            </div>
            <!-- <div v-else class="tips-card">
                <div class="card-content">
                    <div class="summary">
                        <a class="avatar" style="cursor: default;"></a>
                        <div style="width: 80%;">
                            <div class="loading-line1"></div>
                            <div class="loading-line2"></div>
                            <div class="loading-line3 animation-delay"></div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="profile">
                        <div>
                            <span class="count loadingcount"></span>
                            <span class="type loadingtype"></span>
                        </div>
                        <div>
                            <span class="count loadingcount"></span>
                            <span class="type loadingtype"></span>
                        </div>
                        <div>
                            <span class="count loadingcount"></span>
                            <span class="type loadingtype"></span>
                        </div>
                    </div>
                    <div class="social">
                        <button class="loading-bigbtn" style="margin-right: 10px;"></button>
                        <button class="loading-bigbtn"></button>
                    </div>
                </div>
            </div> -->
        </div>
        <div class="arrow arrow-type-bottom" :class="{'arrow-rotation': isArrowRotation}">
            <i><em></em></i>
        </div>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import { isInViewport, getBoundingClientRect } from '~/js/utils/dom.js';
import FollowBtn from '~/js/components/user/FollowBtn.vue';

export default {
    props: [
        'userID',
        'followerID',
        'delay',
    ],
    data () {
        return {
            isShowed: false,
            top: '100%',
            isArrowRotation: false,
            user: null,
            articles: [
                {
                    id: 1,
                    summary: '实用又方便的那种网站推荐！'
                }
            ],
            isFollowed: false,
            timeoutID: 0,
            followedStyle: {
                'background-color': '#64cd3d', 
                'border-color': '#64cd3d', 
                color: '#fff',
                width: '78px', 
                height: '30px',
                'font-size': '13px'
            },
            notFollowedStyle: {
                'background-color': '#fff', 
                'border-color': '#6cbd45', 
                color: '#6cbd45', 
                width: '78px', 
                height: '30px',
                'font-size': '13px'
            },
        };
    },
    mounted() {
        this.timeoutID = setTimeout(() => {
            this.isShowed = true;
            const userID = this.userID;
            myHTTP.get(`/users/${userID}/businesscard`).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.user = res.data.data.user;
                    this.articles = res.data.data.articles;
                    this.isFollowed = res.data.data.isFollowed;
                    this.adjustCoordinate();
                }
            });
            this.adjustCoordinate();
        }, this.delay || 100);
    },
    beforeDestroy() {
        if (this.timeoutID) {
            clearTimeout(this.timeoutID);
        }
    },
    methods: {
        adjustCoordinate() {
            this.top = '100%';
            this.isArrowRotation = false;
            this.$nextTick(() => {
                const dom = this.$refs.box;
                if (!dom) {
                    return;
                }
                if (!isInViewport(dom)) {
                    const clientRect = getBoundingClientRect(dom);
                    this.top = -(clientRect.height + 10) + 'px';
                    this.isArrowRotation = true;
                }
            });
        },
        onFollowChange(userID, isFollowed) {
            this.$emit('followChange', userID, isFollowed);
        },
        changeUserFollow(userID, isFollowed) {
            if (userID === this.userID) {
                this.isFollowed = isFollowed;
            }
        }
    },
    components: {
        FollowBtn,
    }
}
</script>

<style scoped>
.user-card-hidden {
    display: none;
}

.v-tooltip-avatar {
    position: absolute;
}

.user-card-tooltip {
    top: 100%;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    padding-top: 10px;
    z-index: 1;
}

.tips-card-loading, .tips-card {
    width: 268px;
    position: relative;
    left: 0;
    top: 0;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #fff;
    -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
    border: 1px solid #eaeaea;
}

.tips-card {
    z-index: 10;
}

.tips-card .card-content {
    padding: 15px 15px 0 15px;
}

.tips-card .card-content .summary {
    padding: 0 0 0 75px;
    min-height: 80px;
    position: relative;
}

.avatar {
    width: 24px;
    height: 24px;
    display: block;
    cursor: pointer;
    margin-right: 5px;
    width: 38px;
    height: 38px;
    display: inline-block;
}

.tips-card .card-content .summary .avatar {
    position: absolute;
    left: 0;
    top: 0;
    width: 60px;
    height: 60px;
    cursor: pointer;
    border-radius: 50%;
    background-color: #EAEAEA;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}

.name {
    font-size: 15px;
    color: #333;
}

.tips-card .card-content .summary .name {
    height: 26px;
    margin-right: 3px;
    margin-bottom: 8px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-pack: start;
    -webkit-justify-content: flex-start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
}

.tips-card .card-content .summary .name .nickname {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
}

.tips-card .card-content .summary .intro {
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-bottom: 0;
    font-size: 14px;
    line-height: 1.5;
    color: #90969b;
}

.tips-card .card-content .summary .intro.block {
    color: #999999;
}

.tips-card .card-content .summary .list .item {
    display: block;
    margin-bottom: 5px;
    font-size: 13px;
    color: #999999;
    cursor: pointer;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tips-card .card-content .summary .list .item i {
    margin-right: 2px;
}

.ic-article-s:before {
    content: "\E671";
}

.tips-card .card-footer {
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 0;
    padding-bottom: 15px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    overflow: hidden;
    _zoom: 1;
}

.tips-card .card-footer .profile {
    width: 148px;
    overflow: hidden;
    _zoom: 1;
    float: left;
}

.tips-card .card-footer .profile div {
    float: left;
    width: 60px;
    height: 48px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
}

.tips-card .card-footer .profile div span {
    display: block;
    width: 100%;
}

.tips-card .card-footer .profile div .count {
    font-size: 16px;
    color: #333;
    margin-bottom: 4px;
}

.tips-card .card-footer .profile div .loadingcount {
    background-color: #EAEAEA;
    width: 40px;
    height: 18px;
    margin-bottom: 6px;
}

.tips-card .card-footer .profile div .type {
    font-size: 13px;
    color: #90969b;
}

.tips-card .card-footer .profile div .loadingtype {
    background-color: #EAEAEA;
    width: 30px;
    height: 12px;
}

.tips-card .card-footer .social {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-pack: end;
    -webkit-justify-content: flex-end;
    -ms-flex-pack: end;
    justify-content: flex-end;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    float: right;
    overflow: hidden;
    _zoom: 1;
}

.tips-card .card-footer .social .message {
    border: 1px solid rgba(59, 194, 29, 0.7);
    color: #42C02E;
    margin: 0 10px 0 16px;
    font-size: 15px;
    padding: 8px 0;
    width: 90px;
    border-radius: 40px;
    text-align: center;
    cursor: pointer;
    float: left;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.user-follow-button {
    text-align: center;
    border-radius: 40px;
    font-weight: 400;
    border: 1px solid transparent;
    line-height: normal;
}

.user-follow-button.off {
    color: #fff;
    background-color: #42c02e;
}

.tips-card .card-footer .social .user-follow-button {
    font-size: 15px;
    padding: 8px 0;
    width: 100px;
}

.user-follow-button.off i:before {
    content: "\E611";
}

.user-follow-button span {
    margin-left: 2px;
}

.arrow {
    position: absolute;
    width: 100%;
    height: 10px;
    left: 0;
    z-index: 20;
    pointer-events: none;
}

.arrow-type-bottom {
    top: 1px;
}

.arrow i {
    position: absolute;
    left: 50%;
    margin: 0;
    margin-left: -10px;
    border-width: 10px;
    border-color: transparent;
    padding: 0;
}

.arrow-type-bottom i {
    border-bottom-color: #d9d9d9;
    border-style: dashed dashed solid;
    top: -10px;
}

.arrow em {
    display: block;
    position: absolute;
    left: -9px;
    border-width: 9px;
    border-color: transparent;
    margin: 0;
    padding: 0;
}

.arrow-type-bottom em {
    border-style: dashed dashed solid;
    border-bottom-color: #fff;
    top: -8px;
}

.tips-card .card-footer .social .message:hover {
    text-decoration: none;
    border: 1px solid #42C02E;
    color: #42C02E;
    background-color: rgba(59, 194, 29, 0.05);
}

.user-follow-button.off:hover {
    border-color: #3db922;
    background-color: #3db922;
}

.user-follow-button .ic-followed:before {
    content: "\E610"!important;
}

.user-follow-button .ic-unfollow:before {
    content: "\E610"!important;
}

.loading-bigbtn {
    background-color: #EAEAEA;
    width: 100px;
    height: 40px;
    border: none;
    border-radius: 40px;
    cursor: default;
}

.loading-line1 {
    margin-bottom: 10px;
    width: 50%;
    height: 20px;
    background-color: #eaeaea;
}

.loading-line2 {
    width: 100%;
    height: 16px;
    margin: 0 0 10px;
    background-color: #eaeaea;
    -webkit-animation: loading 1s ease-in-out infinite;
    animation: loading 1s ease-in-out infinite;
}

.loading-line3 {
    width: 100%;
    height: 16px;
    margin: 0 0 10px;
    background-color: #eaeaea;
    -webkit-animation: loading 1s ease-in-out infinite;
    animation: loading 1s ease-in-out infinite;
}

.animation-delay {
    -webkit-animation: loading 1s ease-in-out -0.5s infinite !important;
    animation: loading 1s ease-in-out -0.5s infinite !important;
}

.arrow-rotation {
    top: auto!important;
    bottom: -9px;
    -moz-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
}

.follow-button.followed {
    color: #fff;
    border-color: #6cbd45;
    background-color: #6cbd45;
}

</style>

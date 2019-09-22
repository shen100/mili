<template>
    <div class="post-list-box">
        <div class="sub-header">
            <div class="sub-header-title">关注</div>
            <div class="sub-type-box">
                <router-link :to="`/users/${author.id}/follows`" class="sub-type">关注了</router-link>
                <router-link :to="`/users/${author.id}/followers`" class="sub-type active">粉丝</router-link>
                <router-link :to="`/users/${author.id}/followtags`" class="sub-type">关注标签</router-link>
            </div>
        </div>
        <Pinterest :url="`/users/${author.id}/followers`" :start="1" @load="onLoad">
            <template v-slot:loading>
                <div class="user-load-placeholder">
                    <div class="user-load-content">
                        <div class="user-load-name user-load-delay"></div>
                        <div class="user-load-job-box">
                            <div class="user-load-job"></div>
                            <div class="user-load-at">@</div>
                            <div class="user-load-company"></div>
                        </div>
                    </div>
                    <div class="user-load-follower-btn"></div>
                </div>
            </template>
            <template v-slot:content>
                <div>
                    <a :key="follower.id" :href="`/users/${follower.id}`" v-for="follower in followers" target="_blank" class="link user-follow-item">
                        <div class="lazy avatar avatar loaded" :style="{'background-image': `url(${follower.avatarURL})`}"></div>
                        <div class="info-box">
                            <a :href="`/users/${follower.id}`" target="_blank" class="username">{{follower.username}}
                                <a v-if="follower.level" :href="userLevelChapterURL" target="_blank" class="the-rank">
                                    <img :src="follower.level | levelImgURL">
                                </a>
                            </a>
                            <div class="detail">{{follower | jobCompany}}</div>
                        </div>
                        <FollowBtn :userID="follower.id" :followed="follower.isFollowed"></FollowBtn>
                    </a>
                </div>
            </template>
        </Pinterest>
        <div v-if="isEmpty" class="empty-box">
            <img src="../../../images/user/emptybox.svg" />
            <div class="empty-text">这里什么都没有</div>
        </div>
    </div>
</template>

<script>
import { jobCompany, levelImgURL } from '~/js/common/filters.js';
import Pinterest from '~/js/components/common/Pinterest.vue';
import FollowBtn from '~/js/components/user/FollowBtn.vue';

export default {
    data () {
        return {
            author: window.author,
            followers: [],
            userLevelChapterURL: window.userLevelChapterURL,
            isEmpty: false,
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
        onLoad(result) {
            this.followers = this.followers.concat(result.data.data.list);
            if (!result.data.data.count) {
                this.isEmpty = true;
            }
        }
    },
    filters: {
        jobCompany,
        levelImgURL,
    },
    components: {
        Pinterest,
        FollowBtn,
    }
}
</script>

<style lang="scss" scoped>
.link {
    display: flex;
    align-items: center;
    padding: 6px 28px;
    min-height: 84px;
}

.link:not(:last-child) {
    border-bottom: 1px solid rgba(230, 230, 231, .5);
}

.avatar[data-v-7a297ff6] {
    flex: 0 0 auto;
    margin-right: 20px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #eee;
}

.lazy:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: inherit;
    border-radius: inherit;
}

.lazy:not(.immediate):before {
    transition: opacity .2s;
}

.lazy.loaded:before {
    opacity: 0;
    pointer-events: none;
}

.info-box {
    flex: 1 1 auto;
    min-width: 0;
}

.info-box .username {
    font-size: 16px;
    font-weight: 600;
    color: #2e3135;
}

.info-box .detail {
    margin-top: 7px;
    font-size: 12px;
    font-weight: 500;
    color: #b9c0c8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.the-rank {
    vertical-align: baseline!important;
}

.user-follow-item:hover {
    background-color: hsla(0, 0%, 87.1%, .1);
    text-decoration: none;
}

.user-follow-item .username:hover {
    background-color: hsla(0, 0%, 87.1%, .1);
    text-decoration: none;
}

.user-load-placeholder {
    position: relative;
    padding: 20px 28px;
    margin-bottom: 50px;
    overflow: hidden;
    background: #fff;
}

.user-load-content {
    width: 50%;
    padding-top: 0;
    float: left;
}

.user-load-name {
    height: 16px;
    margin: 0 0 7px;
    background-color: #eaeaea;
    -webkit-animation: loading 1s ease-in-out infinite;
    animation: loading 1s ease-in-out infinite;
}

.user-load-job-box {
    display: flex;
}

.user-load-job {
    width: 50px;
    height: 16px;
    background-color: #eaeaea;  
}

.user-load-at {
    margin-left: 5px;
    margin-right: 5px;
    color: #eaeaea;
    line-height: 16px;
}

.user-load-company {
    width: 50px;
    height: 16px;
    background-color: #eaeaea;  
}

.user-load-follower-btn {
    width: 74px;
    height: 30px;
    margin-top: 5px;
    float: right;
    background-color: #eaeaea;
}
</style>
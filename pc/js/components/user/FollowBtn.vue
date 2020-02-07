<template>
    <button class="subscribe-btn follow-btn" :style="isFollowed ? followedStyle : notFollowedStyle"
        @click.stop.prevent="onFollow" @mouseenter="onMouseenter" @mouseleave="onMouseleave" 
        :class="{'followed': isFollowed}">{{followText}}</button>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import { globalEventEmitter, EVENTS } from '~/js/utils/event.js';

export default {
    props: [
        'userID', // 有userID时，是关注用户
        'tagID',  // 有tagID时，是关注标签
        'followed',
        'followedStyle',
        'notFollowedStyle'
    ],
    data () {
        if (this.userID && this.tagID) {
            throw new Error('不能同时传userID 和 tagID');
        }
        return {
            isFollowed: this.followed,
            isMouseEnter: false,
        };
    },
    computed: {
        followText() {
            if (this.isFollowed && this.isMouseEnter) {
                return '取消关注';
            }
            if (this.isFollowed) {
                return '已关注';
            }
            return '关注';
        }
    },
    mounted() {
        if (this.userID) {
            globalEventEmitter.on(EVENTS.USER_FOLLOW_CHANGE, this.changeUserFollow, this);
        } else if (this.tagID) {
            globalEventEmitter.on(EVENTS.TAG_FOLLOW_CHANGE, this.changeTagFollow, this);
        }
    },
    beforeDestroy() {
        globalEventEmitter.remove(EVENTS.USER_FOLLOW_CHANGE, this.changeUserFollow);
        globalEventEmitter.remove(EVENTS.TAG_FOLLOW_CHANGE, this.changeTagFollow);
    },
    methods: {
        onMouseenter() {
            this.isMouseEnter = true;
        },
        onMouseleave() {
            this.isMouseEnter = false;
        },
        onFollow () {
            let url, id;
            if (this.userID) {
                id = this.userID;
                url = `/users/${id}/follow`;
            } else if (this.tagID) {
                id = this.tagID;
                url = `/tags/${id}/follow`;
            }
            let reqMethod;
            if (this.isFollowed) {
                reqMethod = myHTTP.delete;
            } else {
                reqMethod = myHTTP.post;
            }
            reqMethod(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.isFollowed = !this.isFollowed;
                    if (this.userID) {
                        this.$emit('userFollowChange', id, this.isFollowed);
                        globalEventEmitter.emit(EVENTS.USER_FOLLOW_CHANGE, id, this.isFollowed);
                    } else if (this.tagID) {
                        this.$emit('tagFollowChange', id, this.isFollowed);
                        globalEventEmitter.emit(EVENTS.TAG_FOLLOW_CHANGE, id, this.isFollowed);
                    }
                } else if (res.data.errorCode === ErrorCode.LoginTimeout.CODE) {
                    location.href = '/signin?miliref=' + encodeURIComponent(location.href);
                }
            });
        },
        changeUserFollow(id, isFollowed) {
            if (id === this.userID) {
                this.isFollowed = isFollowed;
            }
        },
        changeTagFollow(id, isFollowed) {
            if (id === this.tagID) {
                this.isFollowed = isFollowed;
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.follow-btn {
    flex: 0 0 auto;
    margin: 0 0 0 12px;
    padding: 0;
    width: 90px;
    height: 30px;
    font-size: 12px;
    color: #92c452;
    background-color: #fff;
    border: 1px solid #92c452;
    border-radius: 2px;
    outline: none;
    transition: background-color .3s, color .3s;
    cursor: pointer;
}

.follow-btn:hover {
    opacity: .8;
}

.followed {
    color: #fff;
    background-color: #92c452;
}
</style>
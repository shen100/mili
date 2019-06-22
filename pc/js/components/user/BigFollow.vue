<template>
    <a @click="onFollow" @mouseenter="onMouseenter" @mouseleave="onMouseleave" 
        class="btn big" :class="isFollowed ? followedClass : unfollowedClass">
        <i class="iconfont" :class="followedIClass"></i>
        <span>{{followText}}</span>
    </a>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';

export default {
    props: [
        'userID',
        'userFollowed',
        'onChange',
        'methodProxy'
    ],
    data () {
        if (this.methodProxy) {
            this.methodProxy.setUserFollowed = this.setUserFollowed.bind(this);
        }
        return {
            isFollowed: this.userFollowed,
            isMouseEnter: false,
            unfollowedClass: {
                'btn-success': true,
                follow: true,
            },
            followedClass: {
                'btn-default': true,
                following: true,
            },
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    computed: {
        followedIClass() {
            if (this.isFollowed && this.isMouseEnter) {
                return {
                    'ic-unfollow': true
                };
            }
            if (this.isFollowed) {
                return {
                    'ic-followed': true
                };
            }
            return {
                'ic-follow': true
            };
        },
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
    methods: {
        onMouseenter() {
            this.isMouseEnter = true;
        },
        onMouseleave() {
            this.isMouseEnter = false;
        },
        onFollow () {
            const url = `/users/follow/${this.userID}`;
            let reqMethod;
            if (this.isFollowed) {
                reqMethod = myHTTP.delete;
            } else {
                reqMethod = myHTTP.post;
            }
            reqMethod(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.isFollowed = !this.isFollowed;
                    this.onChange && this.onChange(this.isFollowed);
                } else if (res.data.errorCode === ErrorCode.LoginTimeout.CODE) {
                    location.href = '/signin.html';
                }
            });
        },
        setUserFollowed(userFollowed) {
            this.isFollowed = userFollowed;
        }
    }
}
</script>

<style scoped>
.follow-cancel:focus, .follow-cancel:hover, .follow-each:focus, .follow-each:hover, .following, .following:focus, .following:hover {
    border-color: #969696 !important;
    background-color: rgba(99, 99, 99, 0.05) !important;
    padding: 0 7px 0 5px;
    font-size: 12px;
    color: #8c8c8c !important;
}

.follow {
    margin-top: 4px;
    padding: 8px 0;
    width: 100px;
    font-size: 16px;
}

.big.following {
    margin-top: 4px;
    padding: 8px 0;
    width: 100px;
    font-size: 16px;
}

.btn-default {
    border-radius: 40px;
}

.btn-success:hover {
    color: #fff;
    background-color: #3db922;
    border-color: #318f22;
}

.follow:hover {
    border-color: #3db922 !important;
    color: #fff;
    background-color: #3db922;
}
</style>


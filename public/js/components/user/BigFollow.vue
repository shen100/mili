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
                    this.onChange(this.isFollowed);
                }
            });
        },
        setUserFollowed(userFollowed) {
            this.isFollowed = userFollowed;
        }
    }
}
</script>

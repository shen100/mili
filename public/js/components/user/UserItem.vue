<template>
    <div class="item">
        <div class="user">
            <a :href="`/users/${userData.id}.html`" target="_blank" class="link">
                <div class="lazy avatar avatar loaded" :style="{'background-image': `url(${userData.avatarURL})`}"></div>
                <div class="info-box">
                    <div class="profile">
                        <span class="username" v-html="userData.username"></span>
                        <span class="position">{{userData.job}}</span>
                    </div>
                    <div class="detail">
                        <a :href="`/users/${userData.id}/followers`" target="_blank" rel="">
                            <span>{{userData.followerCount || 0}} 个关注者</span>
                        </a>
                    </div>
                </div>
                <button @click.stop.prevent="onFollow" @mouseenter="onMouseenter" @mouseleave="onMouseleave" 
                    class="follow-button follow-btn" :class="{'followed': isFollowed}">{{followText}}</button>
            </a>
        </div>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';

export default {
    props: [
        'user',
        'keyword',
    ],
    data () {
        const strongHTML = `<em style="color: #e8001c">${this.keyword}</em>`;
        const userData = {
            ...this.user,
            username: this.user.username.replace(this.keyword, strongHTML),
        };
        return {
            isFollowed: userData.isFollowed,
            isMouseEnter: false,
            userData,
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
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
    methods: {
        onMouseenter() {
            this.isMouseEnter = true;
        },
        onMouseleave() {
            this.isMouseEnter = false;
        },
        onFollow () {
            const url = `/users/follow/${this.userData.id}`;
            let reqMethod;
            if (this.isFollowed) {
                reqMethod = myHTTP.delete;
            } else {
                reqMethod = myHTTP.post;
            }
            reqMethod(url).then((res) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                    this.isFollowed = !this.isFollowed;
                }
            });
        },
    }
}
</script>

<style scoped>
.item:not(:last-child) {
    border-bottom: 1px solid rgba(178, 186, 194, .15);
}

.user {
    position: relative;
    box-sizing: border-box;
}

.user:hover {
    background-color: hsla(0, 0%, 87.1%, .1);
}

.link {
    display: flex;
    align-items: center;
    padding: 20px;
    overflow: hidden;
    text-decoration: none;
    cursor: pointer;
    color: #909090;
}

.avatar {
    display: inline-block;
    position: relative;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #eee;
    flex: 0 0 auto;
    margin-right: 24px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
}

.info-box {
    flex: 1 1 auto;
    min-width: 0;
}

.info-box .profile {
    display: flex;
    align-items: baseline;
    font-size: 14px;
    font-weight: 600;
    color: #2e3135;
    max-width: 480px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.username em {
    color: #e8001c;
    font-style: normal;
}

.info-box .position {
    font-size: 13px;
    color: #8a9aa9;
    margin-left: 10px;
    font-weight: 400;
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.info-box .detail {
    margin-top: 7px;
    font-size: 13px;
    color: #8a9aa9;
    font-weight: 400;
    opacity: .9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.info-box .detail:hover, .info-box .detail a {
    color: #8a9aa9;
}

.info-box .detail:hover, .info-box .detail a {
    color: #8a9aa9;
    text-decoration: none;
}

.follow-btn {
    flex: 0 0 auto;
    margin: 0;
    padding: 0;
    width: 74px;
    height: 30px;
    font-size: 13px;
    color: #37c701;
    background-color: #fff;
    border: 1px solid rgba(55, 199, 1, .6);
    border-radius: 2px;
}

.follow-button.followed {
    color: #fff;
    border-color: #6cbd45;
    background-color: #6cbd45;
}

.follow-btn:hover {
    opacity: .8;
}
</style>

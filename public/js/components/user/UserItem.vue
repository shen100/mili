<template>
    <div class="item">
        <div class="user">
            <a href="/user/5a79089b6fb9a0633c65f0a1" target="_blank" class="link">
                <div class="lazy avatar avatar loaded" :style="{'background-image': `url(${userData.avatarURL})`}"></div>
                <div class="info-box">
                    <div class="profile">
                        <span class="username" v-html="userData.username"></span>
                        <span class="position">{{userData.job}}</span>
                    </div>
                    <div class="detail">
                        <a href="/user/5a79089b6fb9a0633c65f0a1/followers" target="_blank" rel="">
                            <span>{{userData.followerCount || 0}} 个关注者</span>
                        </a>
                    </div>
                </div>
                <button class="follow-button follow-btn">关注</button>
            </a>
        </div>
    </div>
</template>

<script>
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
        console.log(userData);
        return {
            userData,
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
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
</style>

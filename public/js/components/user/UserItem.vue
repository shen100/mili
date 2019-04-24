<template>
    <div class="item">
        <div class="user">
            <a href="/user/5a79089b6fb9a0633c65f0a1" target="_blank" class="link">
                <div class="lazy avatar avatar loaded" style="background-image: url(&quot;https://mirror-gold-cdn.xitu.io/168e08de05b253d8f62?imageView2/1/w/45/h/45/q/85/format/webp/interlace/1&quot;);"></div>
                <div class="info-box">
                    <div class="profile">
                        <span class="username"><em>vue</em></span>
                        <span class="position">前端工程师 @ 联想云</span>
                    </div>
                    <div class="detail">
                        <a href="/user/5a79089b6fb9a0633c65f0a1/followers" target="_blank" rel="">
                            <span >13 个关注者</span>
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
    ],
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
    font-size: 13px;
    font-weight: 600;
    color: #2e3135;
    max-width: 480px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.info-box .profile em {
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

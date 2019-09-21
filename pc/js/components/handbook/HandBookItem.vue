<template>
    <div class="handbooks">
        <a href="/handbooks/1.html" target="_blank" class="item">
            <div class="poster">
                <div class="lazy thumb poster-img loaded" style="background-image: url(&quot;http://localhost:9906/images/handbook2.png&quot;); background-size: cover;"></div>
            </div>
            <div class="info">
                <div class="title">
                    <span class="presale">预售</span>
                    <span>WebGL 入门与实践</span>
                </div>
                <div class="desc">介绍 WebGL 与 CSS 3D 开发的点点滴滴，详细阐述 3D 数学库的实现原理与使用，演示 3D 数学库对于 WebGL 开发和普通网页开发的重要作用，助力每个前端开发者轻松掌握 3D 开发的关键技术。</div>
                <div class="author">
                    <div class="author-info">
                        <div target="_blank" class="user">
                            <div class="lazy avatar hero loaded" style="background-image: url(&quot;https://user-gold-cdn.xitu.io/2019/3/14/1697bf1c8f8bdbb1?imageView2/1/w/100/h/100/q/85/format/webp/interlace/1&quot;);"></div>
                            <span>lucefer</span>
                        </div>
                    </div>
                    <div class="author-desc">
                        <span class="selfDescription">某大型互联网公司前端工程师</span>
                    </div>
                </div>
                <div class="other">
                    <div class="price">
                        <div class="price-text">￥39.9</div>
                    </div>
                    <div class="messages">
                        <span class="message">
                            <span>33小节</span>
                        </span>
                        <span class="dot">·</span>
                        <span class="message">
                            <span>阅读时长82分钟</span>
                        </span>
                        <span class="dot">·</span>
                        <span class="message">
                            <span>1485</span>
                            <span>人已购买</span>
                        </span>
                    </div>
                </div>
                <div class="footer-bar" style="display: none;"></div>
            </div>
        </a>
    </div>
</template>

<script>
export default {
    props: [ 'handbook' ],
    data () {
        return {
        };
    },
}
</script>

<style lang="scss" scoped>
.handbooks {
    background: #fff;
}

.handbooks .item {
    display: flex;
    padding: 25px;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;
    border-bottom: 1px solid #e6e8e8;
}

.handbooks .item:hover {
    text-decoration: none;
    background-color: rgba(222, 222, 222, 0.1);
}

.handbooks .item:not(:last-child) {
    border-bottom: 1px solid #e6e8e8;
}

.handbooks .poster {
    width: 100px;
    height: 140px;
    flex-shrink: 0;
    box-shadow: 3px 4px 12px 0 rgba(0, 0, 0, .2);
    overflow: hidden;
    background-color: #ccc;
}

.handbooks .poster .poster-img {
    height: 100%;
    width: 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
}

.handbooks .lazy {
    position: relative;
}

.handbooks .info {
    position: relative;
    flex-grow: 1;
    overflow: hidden;
    box-sizing: border-box;
    font-size: 14px;
    color: #2e3135;
    padding-left: 22px;
}

.handbooks .info .title {
    color: inherit;
    font-size: 20px;
    font-weight: 400;
}

.handbooks .info .title .presale {
    display: inline-block;
    vertical-align: middle;
    padding-left: 6px;
    padding-right: 6px;
    height: 20px;
    margin-top: -3px;
    line-height: 20px;
    color: #fff;
    font-size: 12px;
    cursor: default;
    margin-right: 8px;
    border-radius: 2px;
    background-color: #ed7b11;
}

.handbooks .info .desc {
    margin-top: 5px;
    line-height: 20px;
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    color: #71777c;
}

.handbooks .info .author {
    display: flex;
    align-items: center;
    margin-top: 6px;
    overflow: hidden;
    white-space: nowrap;
}

.handbooks .info .author .author-info {
    flex-shrink: 0;
    display: flex;
    align-items: center;
}

.handbooks .info .author .user {
    display: inline-flex;
    align-items: center;
    color: #000;
}

.handbooks .info .author .hero {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    margin-right: 8px;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
}

.handbooks .info .author .author-desc {
    color: #71777c;
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.handbooks .info .author .author-desc .selfDescription {
    margin-left: 10px;
    margin-right: 10px;
}

.handbooks .info .other {
    margin-top: 6px;
    display: flex;
    align-items: center;
}

.handbooks .info .other .price {
    color: #ed7b11;
    font-size: 18px;
    margin-right: 15px;
    display: inline-flex;
    align-items: center;
}

.handbooks .info .other span.message {
    opacity: .6;
    font-size: 13px;
    color: #71777c;
}

.handbooks .info .other span.message.presale {
    color: #ed7b11;
}

.handbooks .info .footer-bar {
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
</style>
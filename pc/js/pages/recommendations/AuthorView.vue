<template>
    <div class="user-main-box">
        <ul class="user-list-block">
            <li class="item">
                <div class="user">
                    <a href="" target="_blank" class="link">
                        <div class="authors-avatar" style="background-image: url(/images/avatar.jpg)"></div>
                        <div class="info-box">
                            <a href="" target="_blank" class="username">_sx_<a href="" target="_blank" class="rank"><img src="https://b-gold-cdn.xitu.io/v3/static/img/lv-4.2c3fafd.svg" ></a></a>
                            <div class="describe">获得 5220 赞 · 148185 阅读</div>
                        </div>
                        <button class="follow-btn">关注</button>
                    </a>
                </div>
            </li>
            <li class="item">
                <div class="user">
                    <a href="" target="_blank" class="link">
                        <div class="authors-avatar" style="background-image: url(/images/avatar.jpg)"></div>
                        <div class="info-box">
                            <a href="" target="_blank" class="username">_sx_<a href="" target="_blank" class="rank"><img src="https://b-gold-cdn.xitu.io/v3/static/img/lv-4.2c3fafd.svg" ></a></a>
                            <div class="describe">获得 5220 赞 · 148185 阅读</div>
                        </div>
                        <button class="follow-btn">关注</button>
                    </a>
                </div>
            </li>
            <li class="item">
                <div class="user">
                    <a href="" target="_blank" class="link">
                        <div class="authors-avatar" style="background-image: url(/images/avatar.jpg)"></div>
                        <div class="info-box">
                            <a href="" target="_blank" class="username">_sx_<a href="" target="_blank" class="rank"><img src="https://b-gold-cdn.xitu.io/v3/static/img/lv-4.2c3fafd.svg" ></a></a>
                            <div class="describe">获得 5220 赞 · 148185 阅读</div>
                        </div>
                        <button class="follow-btn">关注</button>
                    </a>
                </div>
            </li>
            <li class="item">
                <div class="user">
                    <a href="" target="_blank" class="link">
                        <div class="authors-avatar" style="background-image: url(/images/avatar.jpg)"></div>
                        <div class="info-box">
                            <a href="" target="_blank" class="username">_sx_<a href="" target="_blank" class="rank"><img src="https://b-gold-cdn.xitu.io/v3/static/img/lv-4.2c3fafd.svg" ></a></a>
                            <div class="describe">获得 5220 赞 · 148185 阅读</div>
                        </div>
                        <button class="follow-btn">关注</button>
                    </a>
                </div>
            </li>
            <li class="item">
                <div class="user">
                    <a href="" target="_blank" class="link">
                        <div class="authors-avatar" style="background-image: url(/images/avatar.jpg)"></div>
                        <div class="info-box">
                            <a href="" target="_blank" class="username">_sx_<a href="" target="_blank" class="rank"><img src="https://b-gold-cdn.xitu.io/v3/static/img/lv-4.2c3fafd.svg" ></a></a>
                            <div class="describe">获得 5220 赞 · 148185 阅读</div>
                        </div>
                        <button class="follow-btn">关注</button>
                    </a>
                </div>
            </li>
        </ul>
    </div>
</template>

<style lang="scss">
body {
    background-color: #f4f5f5;
}

.user-main-box {
    width: 960px;
    margin: 0 auto;
}

.user-list-block {
    width: 700px;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
}

.item:not(:last-child) {
    border-bottom: 1px solid rgba(178, 186, 194, .15);
}

.item a:hover {
    text-decoration: none;
}

.user {
    position: relative;
    box-sizing: border-box;
}

.link {
    display: flex;
    align-items: center;
    padding: 6px 28px;
    min-height: 84px;
    color: #b9c0c8;
}

.authors-avatar {
    display: inline-block;
    position: relative;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
    background-color: #eee;
    flex: 0 0 auto;
    margin-right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.info-box {
    flex: 1 1 auto;
    min-width: 0;
}

.info-box .username {
    font-size: 16px;
    font-weight: 500;
    color: #393939;
}

.rank {
    margin-left: 4px;
    vertical-align: middle;
}

.info-box .describe {
    color: #777d81;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
<template>
    <div class="topic_panel">
        <div class="triangle"></div>
        <div class="top">
            <input type="text" placeholder="搜索话题" class="search_input">
            <div class="lazy search_icon loaded immediate" :style="{'background-image': 'url(../../../images/search.svg)'}"></div>
        </div>
        <div class="content">
            <ul class="delete-topic">
                <li>
                    <div class="box">
                        <div class="lazy icon loaded immediate" style="background-image: url();"></div>
                    </div>
                    <span>不添加任何话题</span>
                </li>
            </ul>
            <ul class="topic-list">
                <li>
                    <div class="topic-item">
                        <div class="lazy icon loaded immediate" style="background-image: url();"></div>
                        <div class="topic-content">
                            <span>报 offer</span>
                            <span>246 关注 · 17 沸点</span>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="loading">
                <div class="lazy empty-icon loaded immediate" style="background-image: url();"></div>
            </div>
            <div class="empty">
                <div class="lazy empty-icon loaded immediate" style="background-image: url();"></div>
                <span>搜索列表为空</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.topic_panel {
    display: flex;
    flex-direction: column;
    background: #fff;
    position: absolute;
    top: 34px;
    bottom: 0;
    left: 0;
    width: 316px;
    height: 417px;
    border-radius: 2px;
    box-shadow: 0 5px 18px 0 rgba(0, 0, 0, .16);
}

.topic_panel .triangle {
    position: absolute;
    top: -7px;
    left: 50%;
    width: 0;
    height: 0;
    transform: translate(-50%, -50%);
    border: 9.5px solid transparent;
    border-bottom-color: #fff;
}

.topic_panel .top {
    color: #aeb6c0;
    position: relative;
    padding: 18px 20px 0;
}

.topic_panel input {
    resize: none;
    outline: none;
    width: 100%;
    box-shadow: none;
    border: 1px solid #ddd;
    border-radius: 2px;
    transition: border .3s;
    background-color: #fff;
    box-sizing: border-box;
    display: inline-block;
    height: 32px;
    font-size: 14px;
    color: #666;
    border: .5px solid #e5e5e5;
    padding: 12px 10px;
    outline: none;
    background-color: #fafafb;
}

.topic_panel .top .search_icon {
    width: 21px;
    height: 22px;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    top: 50%;
    margin-top: -2px;
    right: 32px;
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

.lazy.loaded:before {
    opacity: 0;
    pointer-events: none;
}

.topic_panel .content {
    overflow: auto;
    padding: 0;
}

.topic_panel .content .delete-topic {
    cursor: pointer;
    color: #17181a;
    font-size: 14px;
    display: block;
    padding: 0 20px;
}

.topic_panel .content .delete-topic li {
    padding: 16px 0 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid hsla(0, 0%, 59.2%, .1);
}

.topic_panel .content .delete-topic li .box {
    width: 42px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background-color: #eef2f5;
}

 .topic_panel .content .delete-topic li .box .icon {
    width: 22px;
    height: 22px;
    background-repeat: no-repeat;
    background-size: contain;
    background-size: cover;
}

.topic_panel .content .delete-topic li span {
    color: #17181a;
    margin-left: 10px;
}

.topic_panel .content .topic-list li {
    cursor: pointer;
    padding: 0 20px;
    border-bottom: none;
}

.topic-item {
    display: flex;
    flex-grow: 0;
    margin: 0;
    align-items: flex-start;
    cursor: pointer;
    padding: 10px 0;
}

.topic_panel .content .topic-list li .topic-item {
    border-bottom: 1px solid hsla(0, 0%, 59.2%, .1);
}

.icon {
    width: 42px;
    height: 42px;
    border-radius: 6px;
    background-size: cover;
    background-repeat: no-repeat;
}

.topic-content {
    color: #8a9aa9;
    width: 144px;
    max-width: 144px;
    letter-spacing: normal;
    text-align: left;
    margin-left: 14px;
    display: flex;
    flex-direction: column;
}

.topic-content span {
    justify-content: center;
}

.topic-content span {
    padding-top: 1px;
    font-size: 13px;
}

.topic-content span:first-child {
    color: #2e3135;
    font-size: 15px;
}
</style>
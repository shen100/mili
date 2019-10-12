<template>
    <div class="article-placeholder index">
        <div class="img"></div>
        <div class="content">
            <div class="title"></div>
            <div class="text"></div>
            <div class="text animation-delay"></div>
            <div class="meta">
                <div class="read"></div>
                <div class="subscribe-sep"> · </div>
                <div class="read" style="width: 80px;"></div>
                <div class="subscribe-sep"> · </div>
                <div class="read"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.article-placeholder {
    height: 145px;
    margin-bottom: 0;
}

.article-placeholder .title {
    width: 50%;
    margin-bottom: 20px!important;
}

.article-placeholder .img {
    left: 0;
    top: 15px;
    width: 100px;
    height: 140px;
    border-radius: 0;
}

.article-placeholder .content {
    padding-left: 122px;
    padding-right: 40px;
}

.article-placeholder .subscribe-sep {
    font-size: 13px;
    margin-left: 6px;
    margin-right: 6px;
    background: #fff;
    color: #2e3135;
}
</style>

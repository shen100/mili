<template>
    <div class="item">
        <a href="" class="searchcategory">
            <div class="info-box">
                <a target="_blank">
                    <div class="lazy thumb thumb loaded" style="background-image: url(&quot;https://lc-gold-cdn.xitu.io/7b5c3eb591b671749fee.png?imageView2/2/w/200/h/64/q/85/format/webp/interlace/1&quot;); background-size: contain;"></div>
                </a>
                <div class="meta-box">
                    <div class="title" v-html="categoryData.name"></div>
                    <div class="stat">
                        <span class="subscribe">{{categoryData.followerCount || 0}} 关注 · </span>
                        <span class="article">{{categoryData.articleCount || 0}} 文章</span>
                    </div>
                </div>
            </div>
            <div class="action-box">
                <button class="follow-button follow-btn">关注</button>
            </div>
        </a>
    </div>
</template>

<script>
export default {
    props: [
        'keyword',
        'category',
    ],
    data () {
        const strongHTML = `<em style="color: #e8001c">${this.keyword}</em>`;
        const categoryData = {
            ...this.category,
            name: this.category.name.replace(this.keyword, strongHTML),
        };
        return {
            categoryData,
        };
    },
}
</script>

<style scoped>
.item:not(:last-child) {
    border-bottom: 1px solid rgba(178, 186, 194, .15);
}

.no-border-bottom {
    border-bottom: none;
}

.searchcategory {
    display: flex;
    padding: 20px;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
}

.searchcategory:hover {
    text-decoration: none;
}

.searchcategory .info-box {
    display: flex;
}

.searchcategory .thumb {
    width: 45px;
    height: 45px;
}

.searchcategory .meta-box {
    margin-left: 30px;
}

.searchcategory .meta-box .title {
    font-size: 14px;;
    font-weight: 600;
    color: #2e3135;
    margin-bottom: 8px;
}

.searchcategory .meta-box .title em {
    font-style: normal;
    color: #e8001c;
}

.searchcategory .meta-box .stat {
    font-size: 13px;
    color: #2e3135;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.button, button {
    -webkit-appearance: none;
    appearance: none;
    background-color: #007fff;
    color: #fff;
    border-radius: 2px;
    border: none;
    outline: none;
    transition: background-color .3s, color .3s;
    cursor: pointer;
}

.follow-button {
    margin: 0 0 0 auto;
    padding: 0;
    width: 55px;
    height: 26px;
    font-size: 13px;
    border: 1px solid #6cbd45;
    color: #6cbd45;
    background-color: #fff;
}

.searchcategory .action-box .follow-btn {
    padding: 0;
    width: 74px;
    height: 30px;
}

.thumb {
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;
}

.searchcategory:hover {
    background-color: hsla(0, 0%, 87.1%, .1);
}
</style>




<template>
    <div class="post-list-box">
        <div class="sub-header">
            <div class="sub-header-title">专栏</div>
            <div class="sub-type-box">
                <a href="/user/5872f33b61ff4b005c490f1c/posts?sort=popular" class="sub-type">热门</a>
                <a href="/user/5872f33b61ff4b005c490f1c/posts?sort=newest" class="sub-type active">最新</a>
            </div>
        </div>
        <Pinterest url="/articles/my" :start="1" @load="onLoad">
            <template v-slot:loading>
                <div style="padding: 20px; padding-top: 10px;">
                    <ArticleLoading />
                </div>
            </template>
            <template v-slot:content>
                <div>
                    <div class="article-list">
                        <ArticleItem :key="article.id" v-for="article in articles" :article="article" />
                    </div>
                </div>
            </template>
        </Pinterest>
    </div>
</template>

<script>
import ArticleLoading from '~/js/components/article/ArticleLoading.vue';
import ArticleItem from '~/js/components/article/ArticleItem.vue';
import Pinterest from '~/js/components/common/Pinterest.vue';

export default {
    data () {
        return {
            articles: [],
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
        onLoad(result) {
            this.articles = this.articles.concat(result.data.data.list);
        }
    },
    components: {
        ArticleLoading,
        ArticleItem,
        Pinterest,
    }
}
</script>

<style lang="scss" scoped>
.post-list-box, .sub-header {
    background-color: #fff;
}

.list-body .sub-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 28px;
    height: 50px;
    white-space: nowrap;
    border-bottom: 1px solid rgba(230, 230, 231, .5);
}

.list-body .sub-header .sub-header-title {
    margin-right: 12px;
    font-size: 15px;
    font-weight: 600;
    color: #000;
}

.list-body .sub-header .sub-type-box {
    margin-left: auto;
}

.list-body .sub-header .sub-type-box .sub-type {
    position: relative;
    padding: 12px 0;
    font-size: 14px;
    color: #72777b;
}

.list-body .sub-header .sub-type-box .sub-type:not(:last-child) {
    margin-right: 24px;
}

.list-body .sub-header .sub-type-box .sub-type:not(:last-child):after {
    content: "";
    position: absolute;
    top: 50%;
    right: -14px;
    margin-top: -7px;
    width: 1px;
    height: 14px;
    background-color: #b2bac2;
    opacity: .5;
}

.list-body .sub-header .sub-type-box .sub-type.active {
    color: #000;
}

.list-body .sub-header .sub-type-box .sub-type:hover {
    opacity: .8;
    text-decoration: none;
}
</style>
<template>
    <div class="post-list-box">
        <div class="sub-header">
            <div class="sub-header-title">文章</div>
            <div class="sub-type-box">
                <a @click.prevent.stop="changeRoute(`/uc/${author.id}?sort=popular`, 'popular')" class="sub-type" :class="{active: sort === 'popular'}">热门</a>
                <a @click.prevent.stop="changeRoute(`/uc/${author.id}?sort=newest`, 'newest')" class="sub-type" :class="{active: sort === 'newest'}">最新</a>
            </div>
        </div>
        <Pinterest ref="articlePinterest" :url="`/articles/users/${author.id}`" :query="{sort: sort}" @load="onLoad">
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
        <div v-if="isEmpty" class="empty-box">
            <img src="../../../images/user/emptybox.svg" />
            <div class="empty-text">这里什么都没有</div>
        </div>
    </div>
</template>

<script>
import ArticleLoading from '~/js/components/article/ArticleLoading.vue';
import ArticleItem from '~/js/components/article/ArticleItem.vue';
import Pinterest from '~/js/components/common/Pinterest.vue';

export default {
    data () {
        return {
            author: window.author,
            articles: [],
            sort: 'newest',
            isEmpty: false,
        };
    },
    mounted() {
        if (this.$route.query.sort === 'newest') {
            this.sort = 'newest';
        } else if (this.$route.query.sort === 'popular') {
            this.sort = 'popular';
        } else {
            this.sort = 'newest';
        }
    },
    methods: {
        onLoad(result) {
            this.articles = this.articles.concat(result.data.data.list);
            if (!result.data.data.count) {
                this.isEmpty = true;
            }
        },
        changeRoute(location, sort) {
            this.$router.push(location);
            this.sort = sort;
            this.articles = [];
            this.$refs.articlePinterest.refresh({ sort });
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
.article-list {
    width: 100%;
}
</style>

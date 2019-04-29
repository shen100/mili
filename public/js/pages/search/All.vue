<template>
    <div class="search-view">
        <div class="result-list">
            <header>
                <nav class="nav-block">
                    <ul class="nav-list right">
                        <li class="nav-item" :class="{active: period === 0}">
                            <a :href="`/search?query=${encodedKeyword}&period=0`">全部</a>
                        </li>
                        <li class="nav-item" :class="{active: period === 1}">
                            <a :href="`/search?query=${encodedKeyword}&period=1`">一天内</a>
                        </li>
                        <li class="nav-item" :class="{active: period === 2}">
                            <a :href="`/search?query=${encodedKeyword}&period=2`">一周内</a>
                        </li>
                        <li class="nav-item" :class="{active: period === 3}">
                            <a :href="`/search?query=${encodedKeyword}&period=3`">三月内</a>
                        </li>
                    </ul>
                </nav>
            </header>
            <div>
                <Pinterest url="/search" :query="{ keyword, type: 'all', period }" @load="onLoad">
                    <template v-slot:loading>
                        <ArticleLoading />
                    </template>
                    <template v-slot:content>
                        <div>
                            <div class="article-list">
                                <div v-if="category">
                                    <CategoryItem :key="`category-${category.id}`" :category="category" :keyword="keyword" />
                                </div>
                                <ArticleItem :key="aritlce.id" v-for="aritlce in articles" :keyword="keyword" :article="article"/>
                            </div>
                        </div>
                    </template>
                </Pinterest>
            </div>
        </div>
    </div>
</template>

<script>
import ArticleLoading from '~/js/components/article/ArticleLoading.vue';
import ArticleItem from '~/js/components/article/ArticleItem.vue';
import CategoryItem from '~/js/components/category/CategoryItem.vue';
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import Pinterest from '~/js/components/common/Pinterest.vue';

export default {
    data () {
        return {
            keyword: window.searchKeyword,
            period: window.period,
            encodedKeyword: encodeURIComponent(window.searchKeyword),
            category: null,
            articles: []
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
        onLoad(result) {
            this.articles = this.articles.concat(result.data.data.list);
            this.category = result.data.data.category;
        }
    },
    components: {
        ArticleLoading,
        ArticleItem,
        CategoryItem,
        Pinterest,
    }
}
</script>

<style scoped>
.nav-block {
    height: 50px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
    border-bottom: 1px solid rgba(178, 186, 194, .15);
}

.nav-item {
    position: relative;
    cursor: pointer;
}

.nav-block .nav-list .nav-item, .nav-block .nav-list {
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
}

.nav-item {
    position: relative;
    cursor: pointer;
}

.nav-block .nav-list .nav-item {
    padding: 0 8px;
}

.nav-item a {
    text-decoration: none;
    cursor: pointer;
    color: #909090;
}

.nav-item>a:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.nav-block .nav-list .nav-item:not(:last-child):after {
    width: 2px;
    height: 2px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    content: "";
    position: absolute;
    left: 100%;
    top: 50%;
    background-color: #2b445d;
    transform: translateY(-50%);
    opacity: .5;
}

.article-list {
    width: 100%;
}
</style>


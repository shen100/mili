<template>
    <div class="search-view">
        <Pinterest url="/articles" :start="2" :query="{c: categoryID}" @load="onLoad">
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
        <BoilingPointModal />
    </div>
</template>

<script>
import ArticleLoading from '~/js/components/article/ArticleLoading.vue';
import ArticleItem from '~/js/components/article/ArticleItem.vue';
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import Pinterest from '~/js/components/common/Pinterest.vue';
import BoilingPointModal from '~/js/components/boilingpoint/BoilingPointModal.vue';

export default {
    data () {
        return {
            articles: [],
            categoryID: window.categoryID || undefined,
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
        BoilingPointModal,
    }
}
</script>

<style scoped>
</style>


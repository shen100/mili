<template>
    <div>
        <header class="nav-block">
            <ul class="nav-list right">
                <li class="nav-item active">
                    <a href="/search?query=vue&amp;type=article&amp;period=all">全部</a>
                </li>
                <li class="nav-item">
                    <a href="/search?query=vue&amp;type=article&amp;period=d1">一天内</a>
                </li>
                <li class="nav-item">
                    <a href="/search?query=vue&amp;type=article&amp;period=w1">一周内</a>
                </li>
                <li class="nav-item">
                    <a href="/search?query=vue&amp;type=article&amp;period=m3">三月内</a>
                </li>
            </ul>
        </header>
        <ul :key="result.id" v-for="result in results">
            <li>
                <ArticleItem :data="result"/>
            </li>
        </ul>
    </div>
</template>

<script>
import ArticleItem from '~/js/components/article/ArticleItem.vue';

export default {
    data () {
        return {
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
    },
    components: {
        ArticleItem,
    }
}
</script>

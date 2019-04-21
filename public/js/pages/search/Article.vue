<template>
    <div class="search-view">
        <div class="result-list">
            <header>
                <nav class="nav-block">
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
                </nav>
            </header>
            <ul :key="aritlce.id" v-for="aritlce in aritlces">
                <li>
                    <ArticleItem :data="aritlce"/>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import ArticleItem from '~/js/components/article/ArticleItem.vue';
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';

export default {
    data () {
        return {
            keyword: window.keyword,
            aritlces: []
        };
    },
    mounted() {
        this.$nextTick(() => {
            const url = `/search/keyword=?${encodeURIComponent(keyword)}`;
            myHTTP.get(url).then((result) => {
                if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
                }
            });
        });
    },
    methods: {
    },
    components: {
        ArticleItem,
    }
}
</script>

<style scoped>
.nav-block {
    height: 32px;
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
</style>


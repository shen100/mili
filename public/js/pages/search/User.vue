<template>
    <div class="search-view">
        <Pinterest url="/search" :query="{ keyword, type: 'user' }" @load="onLoad">
            <template v-slot:loading>
                <CategoryLoading />
            </template>
            <template v-slot:content>
                <div>
                    <div class="searchcategory-list">
                        <CategoryItem :noBorderBottom="i === categories.length - 1" :key="category.id" v-for="(category, i) in categories" :category="category" />
                    </div>
                    <div style="width: 660px;height: 200px; padding: 20px;  background: #fff;">
                        <CategoryLoading />
                    </div>
                </div>
            </template>
        </Pinterest>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import Pinterest from '~/js/components/common/Pinterest.vue';
import CategoryLoading from '~/js/components/category/CategoryLoading.vue';
import CategoryItem from '~/js/components/category/CategoryItem.vue';

export default {
    data () {
        return {
            keyword: encodeURIComponent(window.keyword),
            categories: []
        };
    },
    mounted() {
        this.$nextTick(() => {
        });
    },
    methods: {
        onLoad(result) {
            this.categories = this.categories.concat(result.data.data.list);
        }
    },
    components: {
        Pinterest,
        CategoryItem,
        CategoryLoading,
    }
}
</script>

<style scoped>
.searchcategory-list {
    background-color: #fff;
    width: 700px;
}
</style>


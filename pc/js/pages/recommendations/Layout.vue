<template>
    <div>
        <!-- <div class="category-nav-box">
            <div class="category-nav">
                <ul class="category-list">
                    <li>
                        <router-link to="/recommendations/authors/recommended" class="category-item" active-class="category-item-select">推荐</router-link>
                    </li>
                    <li :key="category.id" v-for="category in categories">
                        <router-link :to="`/recommendations/authors/${category.pathname}`" class="category-item" active-class="category-item-select">{{category.name}}</router-link>
                    </li>
                </ul>
            </div>
        </div> -->
        <!-- <router-view></router-view> -->
        <h2 class="deving">开发中，敬请期待</h2>
    </div>
</template>

<script>
export default {
    data() {
        return {
            categoryPathName: window.categoryPathName || '',
            categories: window.categories,
        };
    }
}
</script>

<style scoped>
.deving {
    margin-top: 200px;
    text-align: center;
    font-size: 24px;
}
</style>
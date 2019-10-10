<template>
    <div>
        <div class="category-nav-box">
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
        </div>
        <router-view></router-view>
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
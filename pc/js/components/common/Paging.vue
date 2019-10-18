<template>
    <div v-if="totalPage > 1" class="components-pages-box">
        <div class="components-pages">
            <div v-if="curPage > 1" @click="onPrev" class="page prev">上一页</div>
            <div @click="onPageSelect(pageLabel)" :key="i" v-for="(pageLabel, i) in pages" class="page" 
                :class="{omit: pageLabel === '...', current: '' + pageLabel === curPage + ''}">{{pageLabel}}</div>
            <div v-if="curPage < totalPage" @click="onNext" class="page next">下一页</div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['page', 'totalPage'],
    data() {
        return {
            curPage: parseInt(this.page),
            pages: [],
            displayPageCount: 7, // 最多显示多少个页码（包括第一页，和最后一页的页码）
        };
    },
    mounted() {
        this.createPages(this.curPage);
    },
    methods: {
        onPageSelect(page) {
            if (page === '...') {
                return;
            }
            this.createPages(parseInt(page));
            this.$emit('change', this.curPage);
        },
        onPrev() {
            this.createPages(this.curPage - 1);
            this.$emit('change', this.curPage);
        },
        onNext() {
            this.createPages(this.curPage + 1);
            this.$emit('change', this.curPage);
        },
        createPages(currentPage) {
            if (currentPage === 1 && this.totalPage === 1) {
                this.curPage = 1;
                this.pages = [1];
                return;
            }
            const displayRemaining = this.displayPageCount - 2; // 除了第一页，和最后一页外，最多显示的页码
            const pages = [1];
            let start = currentPage - parseInt(displayRemaining / 2);
            let end = currentPage + parseInt(displayRemaining / 2);
            if (start <= 1) {
                start = 2;
                end = start + displayRemaining - 1;
                if (end >= this.totalPage - 1) {
                    end = this.totalPage - 1;
                }
            } else if (end >= this.totalPage - 1) {
                end = this.totalPage - 1;
                start = end - (displayRemaining - 1);
                if (start <= 1) {
                    start = 2;
                }
            }
            if (start !== 2) {
                pages.push('...');
            }
            for (let i = start; i <= end; i++) {
                pages.push(i + '');
            }
            if (end !== this.totalPage - 1) {
                pages.push('...');
            }
            pages.push(this.totalPage + '');
            this.curPage = currentPage;
            this.pages = pages;
        },
    }
}
</script>

<style lang="scss" scoped>
.components-pages-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
}

.components-pages {
    display: flex;
}

.components-pages .page {
    margin-left: 10px;
    margin-right: 10px;
    font-size: 15px;
    cursor: pointer;
    color: #ea6f5a;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.components-pages .page.current {
    color: #232323;
    cursor: default;
}

.components-pages .page.omit {
    color: #666;
    cursor: default;
}
</style>
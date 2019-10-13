<template>
    <div class="components-pages-box">
        <div class="components-pages">
            <div class="page prev">上一页</div>
            <div class="page">1</div>
            <div class="page omit">...</div>
            <div class="page">4</div>
            <div class="page">5</div>
            <div class="page">6</div>
            <div class="page current">7</div>
            <div class="page">8</div>
            <div class="page">9</div>
            <div class="page">10</div>
            <div class="page omit">...</div>
            <div class="page">33</div>
            <div class="page next">下一页</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.components-pages-box {
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #eceded;
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
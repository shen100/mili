<template>
    <div class="global-loading">
        <div class="global-loading-spin">
            <Spin size="large"></Spin>
        </div>
    </div>
</template>

<style scoped>
.global-loading {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background:rgba(255, 255, 255, 0.6);
}

.global-loading-spin {
    position: absolute;
    left: 50%;
    top: 50%;
}

</style>
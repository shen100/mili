<template>
    <div class="user-placeholder index">
        <div class="img"></div>
        <div class="content">
            <div class="text"></div>
            <div class="text animation-delay"></div>
        </div>
        <div class="user-follower-btn"></div>
    </div>
</template>

<style scoped>
.user-placeholder {
    position: relative;
    padding: 20px;
    margin-bottom: 30px;
    overflow: hidden;
}

.user-placeholder .img {
    width: 45px;
    height: 45px;
    margin-right: 30px;
    float: left;
    background-color: #eaeaea;
}

.user-placeholder .content {
    width: 300px;
    padding-right: 160px;
    float: left;
}

.user-placeholder .title {
    float: none!important;
    width: 50%;
    height: 20px;
    margin: 0 0 15px!important;
    background-color: #eaeaea;
}

.user-placeholder .text {
    width: 100%;
    height: 16px;
    margin: 0 0 10px;
    background-color: #eaeaea;
    -webkit-animation: loading 1s ease-in-out infinite;
    animation: loading 1s ease-in-out infinite;
}

.user-placeholder .animation-delay {
    -webkit-animation: loading 1s ease-in-out -.5s infinite!important;
    animation: loading 1s ease-in-out -.5s infinite!important;
}

.user-placeholder .text {
    width: 100%;
    height: 16px;
    margin: 0 0 10px;
    background-color: #eaeaea;
    -webkit-animation: loading 1s ease-in-out infinite;
    animation: loading 1s ease-in-out infinite;
}

.user-placeholder .meta {
    margin: 0;
    color: #eaeaea;
    font-size: 0;
}

.user-placeholder .meta .read {
    height: 16px;
    width: 40px;
    margin-right: 4px;
    display: inline-block;
    vertical-align: middle;
    background-color: #eaeaea;
}

.user-placeholder .meta i {
    margin: 0 5px;
    vertical-align: middle;
}

.user-placeholder .meta .subscribe-sep {
    font-size: 13px;
    margin-left: 6px;
    margin-right: 6px;
    background: #fff;
    color: #2e3135;
}

.user-placeholder .meta .small {
    height: 16px;
    width: 20px;
}

.user-placeholder .meta div {
    display: inline-block;
    vertical-align: middle;
    background-color: #eaeaea;
}

.user-follower-btn {
    width: 74px;
    height: 30px;
    float: right;
    background-color: #eaeaea;
}
</style>

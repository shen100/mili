<template>
    <div class="golang-home-body-right">
        <div class="golang-cell">
            <div class="title">作者信息</div>
            <div class="golang-user-info">
                <div>
                    <a class="golang-sidebar-icon-box">
                        <img class="golang-user-info-icon" src="~assets/images/head.png" alt="">
                    </a>
                    <span class="golang-sidebar-info-box">
                        {{user.name}}
                    </span>
                </div>
                <div class="golang-user-line author-info-text">
                    积分: {{user.score}}
                </div>
                <div class="golang-user-line author-info-text text-italic">
                    像风一样go的废飞起
                </div>
            </div>
        </div>
        <div class="golang-cell">
            <div class="title">作者其他文章</div>
            <ul>
                <li class="golang-cell-item">今天是个好日子</li>
                <li class="golang-cell-item">今天是个好日子</li>
                <li class="golang-cell-item">今天是个好日子</li>
                <li class="golang-cell-item">今天是个好日子</li>
                <li class="golang-cell-item">今天是个好日子</li>
            </ul>
        </div>
        <div class="golang-cell">
            <div class="title">浏览最多的话题</div>
            <ul>
                <li class="golang-cell-item" v-for="item in maxBrowse"><a :href="`/topic/${item.id}`" class="sidebar-articles-title">{{item.name}}</a></li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: [
            'user',
            'maxBrowse'
        ],
        data () {
            return {
            }
        }
    }
</script>


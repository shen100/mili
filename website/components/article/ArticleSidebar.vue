<template>
    <div class="golang-home-body-right">
        <div class="golang-cell">
            <div class="title">作者信息</div>
            <div class="golang-user-info" style="padding-top:16px;">
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
                <div class="golang-user-line author-info-text text-italic">{{user.signature || '这家伙很懒，什么个性签名都没有留下'}}</div>
            </div>
        </div>
        <div class="golang-cell">
            <div class="title">作者近期话题</div>
            <ul>
                <li v-for="topic in articles" class="golang-cell-item"><a :href="`/topic/${topic.id}`" class="sidebar-articles-title">{{topic.name}}</a></li>
            </ul>
        </div>
        <div class="golang-cell">
            <div class="title">热门话题</div>
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
            'maxBrowse',
            'articles'
        ],
        data () {
            return {
            }
        }
    }
</script>


<template>
    <div class="common-body-right">
        <template v-if="!user && userLoginVisible">
            <div class="golang-cell golang-user-info">
                <p>golang中文社区</p>
                <p>您可以<a class="golang-user-info-action sidebar-user-signin" @click="onSignin">登录</a>或<a class="golang-user-info-action sidebar-user-signup" href="/signup">注册</a></p>
            </div>
        </template>
        <div v-if="user && publishTopicVisible" class="golang-user-publish">
            <a href="/topic/create"><button class="signup-button ivu-btn ivu-btn-primary ivu-btn-large">发布话题</button></a>
        </div>
        <div v-if="user && createBookVisible" class="golang-user-publish">
            <a href="/book/create"><button class="signup-button ivu-btn ivu-btn-primary ivu-btn-large">创作图书</button></a>
        </div>
        <div v-if="topicAuthor" class="golang-cell">
            <div class="title">作者信息</div>
            <div class="golang-user-info" style="padding-top:16px;">
                <div>
                    <a :href="'/user/' + topicAuthor.id" target="_blank" class="golang-sidebar-icon-box">
                        <img class="golang-user-info-icon" :src="topicAuthor.avatarURL" alt="">
                    </a>
                    <span class="golang-sidebar-info-box">
                        <a :href="'/user/' + topicAuthor.id" target="_blank">{{topicAuthor.name}}</a>
                    </span>
                </div>
                <div class="golang-user-line author-info-text">
                    积分: {{topicAuthor.score}}
                </div>
                <div class="golang-user-line author-info-text text-italic">{{topicAuthor.signature || '这家伙很懒，什么个性签名都没有留下'}}</div>
            </div>
        </div>
        <div v-if="authorRecentArticles && authorRecentArticles.length" class="golang-cell">
            <div class="title">作者近期话题</div>
            <ul>
                <li v-for="topic in authorRecentArticles" class="golang-cell-item"><a :href="`/topic/${topic.id}`" target="_blank" class="sidebar-articles-title">{{topic.name}}</a></li>
            </ul>
        </div>
        <div v-if="top10Users && top10Visible" class="golang-cell">
			<div class="title">积分榜<a class="top100-link" href="/rank" target="_blank">TOP 100>></a></div>
			<ul>
				<li v-for="item in top10Users" class="golang-cell-item">
					<span class="golang-score-item">{{item.score}}</span>
					<span class="golang-score-item"><a class="user-page-link" :href="'/user/' + item.id" target="_blank">{{item.name}}</a></span>
				</li>
			</ul>
        </div>
        <baidu-ad250x250 />
        <div v-if="maxBrowseVisible && maxBrowseArticles && maxBrowseArticles.length" class="golang-cell">
			<div class="title">热门话题</div>
			<ul>
				<li class="golang-cell-item" v-for="item in maxBrowseArticles"><a :href="`/topic/${item.id}`" target="_blank" class="sidebar-articles-title">{{item.name}}</a></li>
			</ul>
        </div>
        <div v-if="maxCommentVisible && maxCommentArticles && maxCommentArticles.length" class="golang-cell">
            <div class="title">回复最多的话题</div>
            <ul>
                <li class="golang-cell-item" v-for="item in maxCommentArticles"><a :href="`/topic/${item.id}`" target="_blank" class="sidebar-articles-title">{{item.name}}</a></li>
            </ul>
        </div>
        <div v-if="votesMaxBrowse && votesMaxBrowse.length" class="golang-cell">
            <div class="title">热门投票</div>
            <ul>
                <li class="golang-cell-item" v-for="item in votesMaxBrowse"><a :href="`/vote/${item.id}`" class="sidebar-articles-title">{{item.name}}</a></li>
            </ul>
        </div>
        <div v-if="votesMaxComment && votesMaxComment.length" class="golang-cell">
            <div class="title">回复最多的投票</div>
            <ul>
                <li class="golang-cell-item" v-for="item in votesMaxComment"><a :href="`/vote/${item.id}`" class="sidebar-articles-title">{{item.name}}</a></li>
            </ul>
        </div>
        <div v-if="friendLinkVisible" class="golang-cell">
            <div class="title">友情链接</div>
            <ul style="text-align: center;">
                <li class="golang-cell-item"><a href="https://cnodejs.org" target="_blank" class="sidebar-articles-title"><img style="width: 150px;" src="https://cnodejs.org/public/images/cnodejs.svg"/></a></li>
                <li class="golang-cell-item"><a href="https://ruby-china.org/" target="_blank" class="sidebar-articles-title"><img style="width: 150px;" src="https://dn-phphub.qbox.me/assets/images/friends/ruby-china.png"/></a></li>
            </ul>
        </div>
        <div v-if="statVisible" class="golang-cell">
            <div class="title">统计信息</div>
            <ul>
                <li class="golang-cell-item">会员:&nbsp;{{userCount}}&nbsp;个</li>
                <li class="golang-cell-item">话题:&nbsp;{{topicCount}}&nbsp;个</li>
                <li class="golang-cell-item">回复:&nbsp;{{replyCount}}&nbsp;个</li>
            </ul>
        </div>
    </div>
</template>

<script>
    import baiduAd250x250 from '~/components/ad/baidu/ad250x250'

    export default {
        data () {
            return {
                user: this.$store.state.user,
                userCount: this.$store.state.userCount,
                topicCount: this.$store.state.topicCount,
                replyCount: this.$store.state.replyCount,
                top10Users: this.$store.state.top10Users,
                maxCommentArticles: this.$store.state.maxCommentArticles,
                maxBrowseArticles: this.$store.state.maxBrowseArticles,
                votesMaxBrowse: this.$store.state.votesMaxBrowse,
                votesMaxComment: this.$store.state.votesMaxComment,
                topicAuthor: this.$store.state.topicAuthor,
                authorRecentArticles: this.$store.state.authorRecentArticles,
                userLoginVisible: this.$store.state.userLoginVisible,
                publishTopicVisible: this.$store.state.publishTopicVisible,
                createBookVisible: this.$store.state.createBookVisible,
                top10Visible: this.$store.state.top10Visible,
                maxBrowseVisible: this.$store.state.maxBrowseVisible,
                maxCommentVisible: this.$store.state.maxCommentVisible,
                friendLinkVisible: this.$store.state.friendLinkVisible,
                statVisible: this.$store.state.statVisible
            }
        },
        methods: {
            onSignin () {
                location.href = '/signin?ref=' + encodeURIComponent(location.href)
            }
        },
        components: {
            'baidu-ad250x250': baiduAd250x250
        }
    }
</script>

<style>

</style>

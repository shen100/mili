<template>
	<div class="golang-top-header">
		<div class="golang-top-box">
			<div class="golang-top-header-left">
				<div class="golang-logo-container">
                    <a href="/"><img :src="logoURL" /></a>
				</div>
				<div class="golang-header-search">
					<form @submit.prevent="onSearch" action="" target="_blank" method="get" class="golang-top-search">
                        <p style="position: relative;">
    						<input @focus="onInputFocus" @blur="onInputBlur" v-model="q" type="text" class="golang-top-input" v-bind:style="{border: isInputFocus ? '1px #a2a2a2 solid' : '1px #e3e3e3 solid'}" name="topSearch">
                            <span class="search-icon"></span>
                        </p>
					</form>
				</div>
			</div>
            <div class="golang-top-header-nav">
                <ul>
                    <li><a href="/">话题</a></li>
                    <li><a href="/book">在线图书</a></li>
                    <li><a href="/vote">投票</a></li>
                </ul>
            </div>
			<div class="golang-top-header-right">
				<ul>
                    <li><a href="https://github.com/shen100/golang123" target="_blank">golang123源码</a></li>
                    <li><a href="https://github.com/shen100/golang123/issues" target="_blank">问题反馈</a></li>
                    <template v-if="user">
                        <li class="user-message-wrapbox">
                            <Tooltip v-if="userMessages.length" trigger="hover" title="提示标题" placement="bottom">
                                <a href="./" class="user-message-box"><Icon class="user-message" type="ios-bell-outline"></Icon><span class="user-message-tip-count">{{messageCount}}</span></a>
                                <ul slot="content" class="header-message-list">
                                    <li v-for="message in userMessages">
                                        <p v-if="message.type === 'messageTypeCommentArticle'" class="header-message-item"><a :href="`/user/${message.fromUser.id}`" target="_blank" class="header-message-user">{{message.fromUser.name}}</a>&nbsp;回复了你的话题&nbsp;<a @click="onReadMessage(message)" :href="`/topic/${message.sourceID}/#reply-${message.commentID}`" target="_blank" class="header-message-content" :style="{color: message.readed ? '#a0a3a4' : ''}">{{message.data.title}}</a></p>
                                        <p v-else-if="message.type === 'messageTypeCommentVote'" class="header-message-item"><a :href="`/user/${message.fromUser.id}`" target="_blank" class="header-message-user">{{message.fromUser.name}}</a>&nbsp;回复了你的投票&nbsp;<a @click="onReadMessage(message)" :href="`/vote/${message.sourceID}/#reply-${message.commentID}`" target="_blank" class="header-message-content" :style="{color: message.readed ? '#a0a3a4' : ''}">{{message.data.title}}</a></p>
                                        <p v-else-if="message.type === 'messageTypeCommentComment'" class="header-message-item"><a :href="`/user/${message.fromUser.id}`" target="_blank" class="header-message-user">{{message.fromUser.name}}</a>&nbsp;回复了你&nbsp;<a @click="onReadMessage(message)" class="header-message-content" :href="message.sourceName === 'article' ? `/topic/${message.sourceID}/#reply-${message.commentID}` : `/vote/${message.sourceID}/#reply-${message.commentID}`" :style="{color: message.readed ? '#a0a3a4' : ''}" target="_blank">{{message.data.commentContent}}</a></p>
                                    </li>
                                </ul>
                            </Tooltip>
                            <a v-else href="./" class="user-message-box"><Icon class="user-message" type="ios-bell-outline"></Icon></a>
                        </li>
                        <li style="padding-right:0;">
                            <Tooltip v-if="user" trigger="hover" title="提示标题" placement="bottom">
                                <a :href="`/user/${user.id}`" class="header-usre-box">
                                    <span class="header-avatar">
                                        <img :src="user.avatarURL" alt="">
                                    </span>
                                    <span class="header-user-name">{{user.name}}</span>
                                </a>
                                <ul slot="content" class="header-user-box">
                                    <li><a :href="`/user/${user.id}`">个人主页</a></li>
                                    <li v-if="adminVisible"><a href="/admin">后台管理</a></li>
                                    <li><a href="/ac/pwdModify">修改密码</a></li>
                                    <li @click="onSignout">退&nbsp&nbsp出</li>
                                </ul>
                            </Tooltip>
                        </li>
                    </template>
					<template v-else>
						<a @click="onSignin"><li style="color: #333;">登录</li></a>
                        <a href="/signup"><li style="color: #333;">注册</li></a>
					</template>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
    import UserRole from '~/constant/UserRole'
    import request from '~/net/request'
    import ErrorCode from '~/constant/ErrorCode'
    import htmlUtil from '~/utils/html'
    import trimHtml from 'trim-html'

    export default {
        data () {
            let user = this.$store.state.user
            let admins = [
                UserRole.USER_ROLE_ADMIN,
                UserRole.USER_ROLE_SUPER_ADMIN,
                UserRole.USER_ROLE_CRAWLER_ADMIN
            ]
            let adminVisible = false
            if (user && admins.indexOf(user.role) >= 0) {
                adminVisible = true
            }
            return {
                q: '',
                user: user,
                adminVisible: adminVisible,
                isInputFocus: false,
                userMessages: [],
                messages: this.$store.state.messages,
                messageCount: this.$store.state.messageCount,
                logoURL: this.$store.state.siteConfig.logoURL || '/images/logo.png'
            }
        },
        methods: {
            onSearch () {
                let searchURL = 'http://zhannei.baidu.com/cse/search?s=2990237584871814305&entry=1&q=' + encodeURIComponent(this.q)
                window.open(searchURL)
            },
            onInputFocus () {
                this.isInputFocus = true
            },
            onInputBlur () {
                this.isInputFocus = false
            },
            onReadMessage (message) {
                request.readMessage({
                    params: {
                        id: message.id
                    }
                }).then(() => {
                    message.readed = true
                })
            },
            onSignin () {
                location.href = '/signin?ref=' + encodeURIComponent(location.href)
            },
            onSignout () {
                request
                    .logout()
                    .then(res => {
                        if (res.errNo === ErrorCode.SUCCESS) {
                            this.user = null
                            window.location.href = '/signin'
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        mounted () {
            let messages = this.messages || []
            let userMessages = messages.slice(0)
            let maxLen = 15
            for (let i = 0; i < userMessages.length; i++) {
                if (userMessages[i].type === 'messageTypeCommentComment') {
                    let trimObj = trimHtml(userMessages[i].data.commentContent, {
                        limit: maxLen,
                        wordBreak: true,
                        suffix: '...',
                        preserveTags: false,
                        moreLink: false
                    })
                    let content = trimObj.html
                    content = htmlUtil.trimImg(content)
                    userMessages[i].data.commentContent = content
                }
                let title = userMessages[i].data.title || ''
                if (title.length > maxLen) {
                    userMessages[i].data.title = title.substr(0, maxLen) + '...'
                }
                userMessages[i].readed = false
            }
            this.userMessages = userMessages
        }
    }
</script>

<style>

</style>

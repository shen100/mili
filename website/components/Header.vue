<template>
	<div class="golang-top-header">
		<div class="golang-top-box">
			<div class="golang-top-header-left">
				<div class="golang-logo-container">
                    <a href="/"><img src="/images/logo.png" /></a>
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
                    <li><a href="/">首页</a></li>
                    <li><a href="/vote">投票</a></li>
                    <li><a href="/timeline">成长历史</a></li>
                    <li><a href="/about">关于</a></li>
                </ul>
            </div>
			<div class="golang-top-header-right">
				<ul>
                    <li><a href="https://github.com/shen100/golang123" target="_blank">golang123源码</a></li>
                    <li><a href="https://github.com/shen100/golang123/issues" target="_blank">问题反馈</a></li>
                    <template v-if="userData">
                        <li>
                            <Tooltip trigger="hover" title="提示标题" placement="bottom">
                                <a href="" class="user-message-box"><Icon class="user-message" type="ios-bell-outline"></Icon></a>
                                <ul slot="content" class="header-message-list">
                                    <li v-for="message in messages">
                                        <p v-if="1 || message.type === 'messageTypeCommentArticle'">{{message.fromUser.name}}&nbsp;回复了你的话题</p>
                                    </li>
                                </ul>
                            </Tooltip>
                        </li>
                        <li style="padding-right:0;">
                            <Tooltip trigger="hover" title="提示标题" placement="bottom">
                                <a :href="`/user/${user.id}`" class="header-usre-box">
                                    <span class="header-avatar">
                                        <img :src="user.avatarURL" alt="">
                                    </span>
                                    <span class="header-user-name">{{user.name}}</span>
                                </a>
                                <ul slot="content" class="header-user-box">
                                    <li><a :href="`/user/${user.id}`">个人主页</a></li>
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
    import request from '~/net/request'
    import ErrorCode from '~/constant/ErrorCode'
    import '~/utils/bd'

    export default {
        props: [
            'user',
            'messages'
        ],
        data () {
            return {
                q: '',
                userData: this.user,
                isInputFocus: false
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
            onSignin () {
                location.href = '/signin?ref=' + encodeURIComponent(location.href)
            },
            onSignout () {
                request
                    .logout()
                    .then(res => {
                        if (res.errNo === ErrorCode.SUCCESS) {
                            this.userData = null
                            window.location.href = '/signin'
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        mounted () {
        }
    }
</script>

<style>

</style>

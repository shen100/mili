<template>
    <div class="topic-box">
        <div class="topic-main">
            <ul class="topic-nav">
                <li><a href="/"><span>主页</span></a></li>
                <li class="topic-nav-sep"><span>/</span></li>
                <li><span class="publish-label">{{id ? '编辑' : '发布'}}话题</span></li>
            </ul>
            <div class="editor-box-wrap">
                <div class="topic-area">
                    <Form ref="formValidate" :model="formValidate" :rules="ruleInline" :label-width="80">
                        <Form-item label="话题名称" prop="topicName">
                            <Input v-model="formValidate.topicName" placeholder="请输入话题名称" style="width: 400px"></Input>
                        </Form-item>
                        <Form-item label="选择版块" prop="selected">
                            <Select v-model="formValidate.selected" style="width: 400px">
                                <Option :key="item.id" v-for="item in formValidate.categories" :value="item.id + ''">{{item.name}}</Option>
                            </Select>
                        </Form-item>
                        <Form-item class="topic-content" :label-width="0" prop="content">
                            <html-editor v-if="article && article.contentType == 2" :value="formValidate.content" :user="user" @save="onContentSave" @change="onContentChage" />
                            <md-editor v-else :value="formValidate.content" :user="user" @save="onContentSave" @change="onContentChage"></md-editor>
                        </Form-item>
                        <Form-item class="topic-submit" :label-width="0">
                            <Button size="large" v-if="isMounted" type="primary" @click="onSubmit">{{id ? '保存话题' : '发布话题'}}</Button>
                        </Form-item>
                    </Form>
                </div>
            </div>
        </div>
        <ul class="topic-sidebar">
            <li class="topic-sidebar-item">
                <div class="topic-sidebar-title">Markdown 语法参考</div>
                <p>### 单行的标题</p>
                <p>**粗体**</p>
                <p>[链接](https://www.go.com)</p>
                <p>![图片](https://www.go.com/1.jpg)</p>
                <div class="markdown-codeblock">
                    <p>```</p>
                    <p>if (a > 1) {</p>
                    <p>&nbsp;&nbsp;&nbsp;&nbsp;doSomething("代码")</p>
                    <p>}</p>
                    <p>```</p>
                </div>
                <p><a href="https://www.golang123.com/book/30" style="color: #08c;" target="_blank">Markdown参考文档</a></p>
            </li>
            <li class="topic-sidebar-item">
                <div class="topic-sidebar-title">我的近期话题</div>
                <p v-if="hasRecentArticles" v-for="(article, i) in recentArticles" class="topic-sidebar-my" :style="{'border-top': i == 0 ? 'none;' : '1px solid #f0f0f0;'}"><a :href="'/topic/' + article.id" target="_blank">{{article.name}}</a></p>
                <p v-else class="topic-none" style="padding-left: 0;">暂无话题</p>
            </li>
        </ul>
    </div>
</template>

<script>
    import request from '~/net/request'
    import Editor from '~/components/Editor'
    import HTMLEditor from '~/components/HTMLEditor'
    import ErrorCode from '~/constant/ErrorCode'
    import UserStatus from '~/constant/UserStatus'
    import config from '~/config'

    export default {
        props: [
            'categories',
            'article',
            'recentArticles',
            'hasRecentArticles',
            'id',
            'user'
        ],
        data () {
            return {
                isMounted: false,
                formValidate: {
                    topicName: (this.article && this.article.name) || '',
                    categories: this.categories,
                    selected: (this.article && this.article.categories[0].id + '') || '',
                    content: (this.article && (this.article.content || this.article.htmlContent)) || ''
                },
                ruleInline: {
                    topicName: [
                        { required: true, message: '请输入话题名称', trigger: 'blur' }
                    ],
                    selected: [
                        { required: true, message: '请选择板块', trigger: 'change' }
                    ],
                    content: [
                        { required: true, message: '请输入话题内容', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted () {
            this.isMounted = true
        },
        methods: {
            onContentChage (content) {
                this.formValidate.content = content
            },
            onSubmit () {
                if (this.user.status === UserStatus.STATUS_IN_ACTIVE) {
                    if (this.id) {
                        this.$Message.error({
                            duration: config.messageDuration,
                            closable: true,
                            content: '账号未激活，不能保存话题'
                        })
                    } else {
                        this.$Message.error({
                            duration: config.messageDuration,
                            closable: true,
                            content: '账号未激活，不能发布话题'
                        })
                    }
                    return
                }
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        let self = this
                        let func = this.id ? request.updateArticle : request.createArticle
                        func({
                            body: {
                                id: this.id,
                                name: this.formValidate.topicName,
                                content: this.formValidate.content,
                                categories: [
                                    {
                                        id: parseInt(this.formValidate.selected)
                                    }
                                ]
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.ERROR) {
                                self.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: res.msg
                                })
                            } else if (res.errNo === ErrorCode.IN_ACTIVE) {
                                if (self.id) {
                                    self.$Message.error('账号未激活，不能保存话题')
                                } else {
                                    self.$Message.error('账号未激活，不能发布话题')
                                }
                            } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                                location.href = '/signin?ref=' + encodeURIComponent(location.href)
                            } else if (res.errNo === ErrorCode.SUCCESS) {
                                setTimeout(function () {
                                    location.href = '/topic/' + res.data.id
                                }, 500)
                            }
                        }).catch(err => {
                            self.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: err.message || err.msg
                            })
                        })
                    }
                })
                return false
            },
            onContentSave () {
                this.onSubmit()
            }
        },
        components: {
            'md-editor': Editor,
            'html-editor': HTMLEditor
        }
    }
</script>

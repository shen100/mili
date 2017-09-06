<template>
    <div>
        <app-header :user="user" />
        <div class="vote-box">
            <div class="vote-main">
                <ul class="vote-nav">
                    <li><a href="/"><span>主页</span></a></li>
                    <li class="vote-nav-sep"><span>/</span></li>
                    <li><span class="publish-label">发布话题</span></li>
                </ul>
                <div class="vote-box-wrap">
                    <div class="vote-area">
                        <Form ref="formValidate" :model="formValidate" :rules="ruleInline" :label-width="80">
                            <Form-item label="投票名称" prop="voteName">
                                <Input v-model="formValidate.voteName" placeholder="请输入话题名称" style="width: 400px"></Input>
                            </Form-item>
                            <Form-item label="结束时间" prop="date">
                                <Date-picker type="date" v-model="formValidate.date" :options="dataOption" placeholder="选择日期" style="width: 400px" @on-change="onDateChange"/>
                            </Form-item>
                            <Form-item class="vote-content" :label-width="0" prop="content">
                                <md-editor :value="formValidate.content" @change="onContentChage"></md-editor>
                            </Form-item>
                            <Form-item
                                v-for="(item, index) in formValidate.items"
                                :key="index"
                                :label="'投票项' + (index + 1)"
                                :prop="'items.' + index + '.value'"
                                :rules="{required: true, message: '投票项' + (index + 1) +'不能为空', trigger: 'blur'}">
                                <Row>
                                    <Col span="18">
                                        <Input type="text" v-model="item.value" placeholder="请输入..."></Input>
                                    </Col>
                                    <Col span="4" offset="1">
                                        <Button type="ghost" @click="handleRemove(index)">删除</Button>
                                    </Col>
                                </Row>
                            </Form-item>
                            <Form-item>
                                <Row>
                                    <Col span="12">
                                        <Button type="dashed" long @click="handleAdd" icon="plus-round">增加投票项</Button>
                                    </Col>
                                </Row>
                            </Form-item>
                            <Form-item class="vote-submit" :label-width="0">
                                <Button size="large" type="primary" @click="onSubmit()">发起投票</Button>
                            </Form-item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
        <app-footer></app-footer>
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import Editor from '~/components/Editor'
    import request from '~/net/request'
    import dataTool from '~/utils/date'
    import ErrorCode from '~/constant/ErrorCode'
    import {trim} from '~/utils/tool'

    export default {
        data () {
            return {
                formValidate: {
                    voteName: '',
                    date: '',
                    content: '',
                    items: [
                        {
                            value: ''
                        },
                        {
                            value: ''
                        }
                    ]
                },
                ruleInline: {
                    voteName: [
                        { required: true, message: '请输入投票名称', trigger: 'blur' }
                    ],
                    date: [
                        { required: true, message: '请选择结束日期', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '请输入投票内容', trigger: 'blur' }
                    ]
                },
                dataOption: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000
                    }
                },
                success: false
            }
        },
        asyncData (context) {
            return {
                user: context.user
            }
        },
        head () {
            return {
                title: '创建投票',
                link: [
                    { rel: 'stylesheet', href: '/styles/editor/simplemde.min.css' }
                ]
            }
        },
        methods: {
            onSubmit () {
                this.$refs['formValidate'].validate((valid) => {
                    console.log(this.formValidate.date)
                    if (valid) {
                        request.createVote({
                            body: {
                                vote: {
                                    name: trim(this.formValidate.voteName),
                                    content: this.formValidate.content,
                                    endAt: dataTool.parse(this.formValidate.date)
                                },
                                voteItems: this.formValidate.items.map(item => {
                                    return {
                                        name: trim(item.value)
                                    }
                                })
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.SUCCESS) {
                                this.$Message.success('创建话题成功')
                                setTimeout(function () {
                                    location.href = '/vote/' + res.data.id
                                }, 500)
                            } else {
                                this.$Message.error(res.msg)
                            }
                        }).catch(err => {
                            this.$Message.error(err.message)
                        })
                    }
                })
            },
            onContentChage (content) {
                this.formValidate.content = content
            },
            handleAdd () {
                if (!(this.formValidate.length < 20)) {
                    return this.$Message.error('投票项最多只能创建20个')
                }
                this.formValidate.items.push({
                    value: ''
                })
            },
            handleRemove (index) {
                if (this.formValidate.items.length === 2) {
                    return this.$Message.error('至少保存两个投票项')
                }
                this.formValidate.items.splice(index, 1)
            },
            onDateChange (date) {
                this.formValidate.date = date
            }
        },
        middleware: 'userRequired',
        components: {
            'app-header': Header,
            'app-footer': Footer,
            'md-editor': Editor
        }
    }
</script>

<style>
    @import '~assets/styles/vote/create.css';
</style>

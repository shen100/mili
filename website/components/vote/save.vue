<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleInline" :label-width="80">
        <Form-item label="投票名称" prop="voteName">
            <Input v-model="formValidate.voteName" placeholder="请输入话题名称" style="width: 400px"></Input>
        </Form-item>
        <Form-item label="结束时间" prop="date">
            <Date-picker type="datetime" v-model="formValidate.date" placeholder="选择日期" style="width: 400px" @on-change="onDateChange"/>
        </Form-item>
        <Form-item class="vote-content" :label-width="0" prop="content">
            <md-editor :user="user" :value="formValidate.content" @change="onContentChage"></md-editor>
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
                    <Button v-if="id" type="primary" @click="addItem(index)" style="margin-right: 10px">保存</Button>
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
</template>

<script>
    import config from '~/config'
    import Editor from '~/components/Editor'
    import request from '~/net/request'
    import ErrorCode from '~/constant/ErrorCode'
    import {trim} from '~/utils/tool'
    import UserStatus from '~/constant/UserStatus'

    export default {
        props: [
            'vote',
            'user',
            'id'
        ],
        data () {
            return {
                formValidate: {
                    voteName: (this.vote && this.vote.name) || '',
                    date: (this.vote && this.vote.endAt && new Date(this.vote.endAt)) || null,
                    content: (this.vote && this.vote.content) || '',
                    items: (this.vote && this.vote.voteItems.map(item => {
                        return {
                            id: item.id,
                            value: item.name
                        }
                    })) || [
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
                        { required: true, type: 'date', message: '请选择结束时间', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '请输入投票内容', trigger: 'blur' }
                    ]
                },
                dataOption: {
                    disabledDate (date) {
                        // 并未起作用，先保留吧
                        return date && date.valueOf() < Date.now() - 86400000
                    }
                },
                success: false
            }
        },
        methods: {
            onSubmit () {
                let self = this
                if (this.user.status === UserStatus.STATUS_IN_ACTIVE) {
                    if (this.id) {
                        this.$Message.error({
                            duration: config.messageDuration,
                            closable: true,
                            content: '账号未激活，不能保存投票'
                        })
                    } else {
                        this.$Message.error({
                            duration: config.messageDuration,
                            closable: true,
                            content: '账号未激活，不能发布投票'
                        })
                    }
                    return
                }

                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        let postBody = {}
                        let func = this.id ? request.updateVote : request.createVote
                        if (this.id) {
                            postBody = {
                                id: parseInt(this.id),
                                name: trim(this.formValidate.voteName),
                                content: this.formValidate.content,
                                endAt: this.formValidate.date
                            }
                        } else {
                            postBody = {
                                vote: {
                                    name: trim(this.formValidate.voteName),
                                    content: this.formValidate.content,
                                    endAt: this.formValidate.date
                                },
                                voteItems: this.formValidate.items.map(item => {
                                    return {
                                        name: trim(item.value)
                                    }
                                })
                            }
                        }
                        func({
                            body: postBody
                        }).then(res => {
                            if (res.errNo === ErrorCode.SUCCESS) {
                                setTimeout(function () {
                                    location.href = '/vote/' + res.data.id
                                }, 500)
                            } else if (res.errNo === ErrorCode.IN_ACTIVE) {
                                if (self.id) {
                                    self.$Message.error({
                                        duration: config.messageDuration,
                                        closable: true,
                                        content: '账号未激活，不能保存投票'
                                    })
                                } else {
                                    self.$Message.error({
                                        duration: config.messageDuration,
                                        closable: true,
                                        content: '账号未激活，不能发布投票'
                                    })
                                }
                            } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                                location.href = '/signin?ref=' + encodeURIComponent(location.href)
                            } else {
                                self.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: res.msg
                                })
                            }
                        }).catch(err => {
                            this.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: err.message
                            })
                        })
                    }
                })
            },
            onContentChage (content) {
                this.formValidate.content = content
            },
            handleAdd () {
                if (!(this.formValidate.items.length < 20)) {
                    return this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: '投票项最多只能创建20个'
                    })
                }
                this.formValidate.items.push({
                    value: ''
                })
            },
            handleRemove (index) {
                if (this.formValidate.items.length === 2) {
                    return this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: '至少保存两个投票项'
                    })
                }

                if (this.id) {
                    let itemId = this.formValidate.items[index].id || ''
                    if (itemId) {
                        request.deleteVoteItem({
                            params: {
                                id: itemId
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.SUCCESS) {
                                this.formValidate.items.splice(index, 1)
                            } else {
                                this.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: res.msg
                                })
                            }
                        }).catch(err => {
                            this.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: err.message
                            })
                        })
                    } else {
                        this.formValidate.items.splice(index, 1)
                    }
                } else {
                    this.formValidate.items.splice(index, 1)
                }
            },
            onDateChange (date) {
                this.formValidate.date = date
            },
            addItem (index) {
                let body = {}
                if (this.formValidate.items[index].id) {
                    body = {
                        id: this.formValidate.items[index].id,
                        name: this.formValidate.items[index].value
                    }
                } else {
                    body = {
                        voteID: parseInt(this.id),
                        name: this.formValidate.items[index].value
                    }
                }
                let func = this.formValidate.items[index].id ? request.editVoteItem : request.addVoteItem
                func({
                    body: body
                }).then(res => {
                    if (res.errNo === ErrorCode.SUCCESS) {
                        console.log(res)
                        this.$Message.success({
                            duration: config.messageDuration,
                            closable: true,
                            content: '操作投票项成果'
                        })
                    } else {
                        this.$Message.error({
                            duration: config.messageDuration,
                            closable: true,
                            content: res.msg
                        })
                    }
                }).catch(err => {
                    this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: err.message || err.msg
                    })
                })
            }
        },
        components: {
            'md-editor': Editor
        }
    }
</script>

<template>
    <div>
        <app-header :user="user" />
        <div class="golang-home-body">
            <div class="golang-main-top">
                <div class="mine-img-box"></div>
                <div class="mine-edit-container">
                    <div class="mine-info-icon">
                        <img :src="user.avatarURL" alt="" />
                        <div class="mine-info-upload">
                            <img src="~assets/images/camera_fill.png" alt="">
                            <p>修改我的头像</p>
                        </div>
                    </div>
                    <p class="mine-info-line mine-info-name">
                        {{user.name}}
                        <a class="home-link-box no-underline" :href="`/user/${user.id}`">返回我的首页&nbsp&nbsp<Icon type="chevron-right"></Icon></a>
                    </p>
                    <div class="mine-info-line mine-info-edit-top">
                        <span class="mine-info-label">性别</span>
                        <span class="mine-info-value" v-if="editIndex[0] === 0">
                            {{userInfo.sex === 1 ? '女' : '男'}}
                            <span class="edit-action" @click="editItem('sex', 0)">
                                <i class="ivu-icon ivu-icon-edit"></i>
                                修改
                            </span>
                        </span>
                        <div class="edit-item" v-else>
                            <RadioGroup v-model="formCustom.sex" size="large">
                                <Radio label="0">
                                    <span class="radio-label">男</span>
                                </Radio>
                                <Radio label="1">
                                    <span class="radio-label">女</span>
                                </Radio>
                                <Row class="button-box">
                                    <Button type="primary" class="button-seq" @click="submit('sex', 0)">确定</Button>
                                    <Button type="ghost" @click="close('sex', 0)">取消</Button>
                                </Row>
                            </RadioGroup>
                        </div>
                    </div>
                    <div class="mine-info-line mine-info-edit">
                        <span class="mine-info-label">一句话介绍</span>
                        <span class="mine-info-value" v-if="editIndex[1] === 0">
                            {{userInfo.signature}}
                            <span class="edit-action" :style="!userInfo.signature ? 'display: inline' : ''" @click="editItem('signature', 1)">
                                <i class="ivu-icon ivu-icon-edit"></i>
                                修改
                            </span>
                        </span>
                        <div v-else class="edit-item">
                        <Input v-model="formCustom.signature" style="width: 300px" type="textarea"></Input>
                        <Row class="button-box">
                            <Button type="primary" class="button-seq" @click="submit('signature', 1)">确定</Button>
                            <Button type="ghost" @click="close('signature', 1)">取消</Button>
                        </Row>
                        </div>
                    </div>
                    <div class="mine-info-line mine-info-edit">
                        <span class="mine-info-label">所在地</span>
                        <span class="mine-info-value" v-if="editIndex[2] === 0">{{userInfo.location}}
                            <span class="edit-action" :style="!userInfo.location ? 'display: inline' : ''" @click="editItem('location', 2)">
                                <i class="ivu-icon ivu-icon-edit"></i>
                                修改
                            </span>
                        </span>
                        <div v-else class="edit-item">
                            <Input v-model="formCustom.location" style="width: 300px" type="textarea"></Input>
                            <Row class="button-box">
                                <Button type="primary" class="button-seq" @click="submit('location', 2)">确定</Button>
                                <Button type="ghost" @click="close('location', 2)">取消</Button>
                            </Row>
                        </div>
                    </div>
                    <div class="mine-info-line mine-info-edit">
                        <span class="mine-info-label">个人简介</span>
                        <span class="mine-info-value" v-if="editIndex[3] === 0">
                            {{userInfo.introduce}}
                            <span class="edit-action" :style="!userInfo.introduce ? 'display: inline' : ''" @click="editItem('introduce', 3)">
                                <i class="ivu-icon ivu-icon-edit"></i>
                                修改
                            </span>
                        </span>
                        <div v-else class="edit-item">
                            <Input v-model="formCustom.introduce" style="width: 300px" type="textarea"></Input>
                            <Row class="button-box">
                                <Button type="primary" class="button-seq" @click="submit('introduce', 3)">确定</Button>
                                <Button type="ghost" @click="close('introduce', 3)">取消</Button>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <app-footer />
    </div>
</template>

<script>
    import Header from '~/components/Header'
    import Footer from '~/components/Footer'
    import request from '~/net/request'
    import ErrorCode from '~/constant/ErrorCode'

    export default {
        data () {
            return {
                editIndex: [0, 0, 0, 0],
                success: false
            }
        },
        asyncData (context) {
            return request.userInfoDetail({
                client: context.req
            }).then(res => {
                if (res.errNo === ErrorCode.SUCCESS) {
                    let userInfo = res.data.user
                    let formCustom = {
                        sex: userInfo.sex,
                        signature: userInfo.signature,
                        location: userInfo.location,
                        introduce: userInfo.introduce
                    }
                    return {
                        userInfo: userInfo,
                        formCustom: formCustom,
                        user: context.user
                    }
                } else {
                    context.error({ statusCode: 404, message: 'Page not found' })
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        methods: {
            editItem (name, index) {
                this.editIndex[index] = 1
                this.editIndex = Array.from(this.editIndex)
            },
            close (name, index) {
                this.editIndex[index] = 0
                this.editIndex = Array.from(this.editIndex)
            },
            submit (name, index) {
                if (this.formCustom[name] === '') {
                    this.close(name, index)
                    return this.$Message.error('信息不能为空')
                }
                let body = {}
                body[name] = this.formCustom[name]
                if (name === 'sex') {
                    body[name] = parseInt(body[name])
                }
                request.updateInfo({
                    params: {
                        type: name
                    },
                    body: body
                }).then(res => {
                    if (res.errNo === ErrorCode.SUCCESS) {
                        this.$Message.success('更新信息成功')
                        this.userInfo[name] = res.data[name]
                    } else {
                        this.$Message.error(res.msg)
                    }
                    this.close(name, index)
                }).catch(err => {
                    console.log(err.message)
                })
            }
        },
        middleware: 'userRequired',
        mounted () {
            console.log(this.userInfo)
        },
        head () {
            return {
                title: '个人信息'
            }
        },
        components: {
            'app-header': Header,
            'app-footer': Footer
        }
    }
</script>

<style>
    @import '~assets/styles/mine/index.css'
</style>
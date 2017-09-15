<template>
    <div>
        <app-header :user="user" />
        <div class="golang-home-body">
            <div class="golang-main-top">
                <div class="mine-img-box" :style="{'background-image': 'url(' + userInfo.coverURL + ')'}"></div>
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
                                    <Button type="primary" class="button-seq" @click="submit('sex', 0)">保存</Button>
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
                        <Input v-model="formCustom.signature" style="width: 700px"></Input>
                        <Row class="button-box">
                            <Button type="primary" class="button-seq" @click="submit('signature', 1)">保存</Button>
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
                            <Input v-model="formCustom.location" style="width: 700px"></Input>
                            <Row class="button-box">
                                <Button type="primary" class="button-seq" @click="submit('location', 2)">保存</Button>
                                <Button type="ghost" @click="close('location', 2)">取消</Button>
                            </Row>
                        </div>
                    </div>
                    <div class="mine-info-line mine-info-edit">
                        <span class="mine-info-label">教育经历</span>
                        <span class="mine-info-value" v-if="editIndex[4] === 0">
                            <span
                                class="edit-action"
                                style="display: inline-block;padding: 8px 0 9px 0;"
                                @click="editItem('school', 4)">
                                    <i class="ivu-icon ivu-icon-android-add-circle"></i>
                                    添加教育经历
                            </span>
                        </span>
                        <div v-else class="edit-item">
                            <Input v-model="formCustom.school.name" placeholder="学校或教育机构名" class="button-seq" style="width: 300px"></Input>
                            <Input v-model="formCustom.school.speciality" placeholder="专业方向" class="button-seq" style="width: 300px"></Input>
                            <Button type="primary" class="button-seq" @click="addSchool">保存</Button>
                            <Button type="ghost" @click="close('school', 4)">取消</Button>
                        </div>
                        <p
                            class="schools-item"
                            v-for="(item, index) in userInfo.schools">
                                {{item.name}}&nbsp{{item.speciality ? '•&nbsp' + item.speciality : ''}}
                                <i class="ivu-icon ivu-icon-close schools-delete" @click="deleteSchool(item.id)"></i>
                            </p>
                    </div>
                    <div class="mine-info-line mine-info-edit">
                        <span class="mine-info-label">职业经历</span>
                        <span class="mine-info-value" v-if="editIndex[5] === 0">
                            <span
                                class="edit-action"
                                style="display: inline-block;padding: 8px 0 9px 0;"
                                @click="editItem('career', 5)">
                                    <i class="ivu-icon ivu-icon-android-add-circle"></i>
                                    添加职业经历
                            </span>
                        </span>
                        <div v-else class="edit-item">
                            <Input v-model="formCustom.career.company" placeholder="公司或组织名称" class="button-seq" style="width: 300px"></Input>
                            <Input v-model="formCustom.career.title" placeholder="你的职位" class="button-seq" style="width: 300px"></Input>
                            <Button type="primary" class="button-seq" @click="addCareer">保存</Button>
                            <Button type="ghost" @click="close('career', 5)">取消</Button>
                        </div>
                        <p
                            class="schools-item"
                            v-for="(item, index) in userInfo.careers">
                                {{item.company}}&nbsp{{'•&nbsp' + item.title}}
                                <i class="ivu-icon ivu-icon-close schools-delete" @click="deleteCareer(item.id)"></i>
                            </p>
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
                            <Input v-model="formCustom.introduce" style="width: 700px" :rows="4" type="textarea"></Input>
                            <Row class="button-box">
                                <Button type="primary" class="button-seq" @click="submit('introduce', 3)">保存</Button>
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
    import {trim} from '~/utils/tool'

    export default {
        data () {
            return {
                editIndex: [0, 0, 0, 0, 0, 0],
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
                        introduce: userInfo.introduce,
                        school: {},
                        career: {}
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
                body[name] = trim(this.formCustom[name])
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
                        this.close(name, index)
                    } else {
                        this.$Message.error(res.msg)
                    }
                }).catch(err => {
                    this.$Message.error(err.message)
                })
            },
            addSchool () {
                if (!this.formCustom.school.name) {
                    return this.$Message.error('教育机构不能为空')
                }
                request.schoolAdd({
                    body: {
                        name: trim(this.formCustom.school.name || ''),
                        speciality: trim(this.formCustom.school.speciality || '')
                    }
                }).then(res => {
                    if (res.errNo === ErrorCode.SUCCESS) {
                        this.formCustom.school.name = ''
                        this.formCustom.school.speciality = ''
                        this.userInfo.schools.push(res.data)
                        this.close('school', 4)
                    } else {
                        this.$Message.error(res.msg)
                    }
                }).catch(err => {
                    this.$Message.error(err.message)
                })
            },
            deleteSchool (id) {
                request.schoolDelete({
                    params: {
                        id: id
                    }
                }).then(res => {
                    if (res.errNo === ErrorCode.SUCCESS) {
                        let id = res.data.id
                        this.userInfo.schools = this.userInfo.schools.filter(item => item.id !== id)
                        this.$Message.success('操作成功')
                    } else {
                        this.$Message.error(res.msg)
                    }
                }).catch(err => {
                    this.$Message.error(err.message)
                })
            },
            addCareer () {
                if (!this.formCustom.career.company || !this.formCustom.career.title) {
                    return this.$Message.error('信息不完整')
                }
                request.careerAdd({
                    body: {
                        company: trim(this.formCustom.career.company || ''),
                        title: trim(this.formCustom.career.title || '')
                    }
                }).then(res => {
                    if (res.errNo === ErrorCode.SUCCESS) {
                        this.formCustom.career.company = ''
                        this.formCustom.career.title = ''
                        this.userInfo.careers.push(res.data)
                        this.close('career', 5)
                    } else {
                        this.$Message.error(res.msg)
                    }
                }).catch(err => {
                    this.$Message.error(err.message)
                })
            },
            deleteCareer (id) {
                request.careerDelete({
                    params: {
                        id: id
                    }
                }).then(res => {
                    if (res.errNo === ErrorCode.SUCCESS) {
                        let id = res.data.id
                        this.userInfo.careers = this.userInfo.careers.filter(item => item.id !== id)
                        this.$Message.success('操作成功')
                    } else {
                        this.$Message.error(res.msg)
                    }
                }).catch(err => {
                    this.$Message.error(err.message)
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

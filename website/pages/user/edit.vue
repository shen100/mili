<template>
    <div>
        <div class="golang-home-body">
            <div class="golang-main-top">
                <div class="mine-img-box" :style="{'background-image': 'url(' + userInfo.coverURL + ')'}"></div>
                <div class="mine-edit-container">
                    <div class="mine-info-icon">
                        <img :src="avatarURL" alt="" />
                        <div class="mine-info-upload">
                            <Upload style="width:160px; height: 160px;"
                                action=""
                                accept="image/*"
                                :show-upload-list="false"
                                :format="['jpg','jpeg','png']"
                                :on-format-error="onFormatError"
                                :before-upload="beforeUpload">
                                <Icon class="mine-info-upload-icon" type="camera"></Icon>
                                <p>修改我的头像</p>
                            </Upload>
                        </div>
                        <Modal v-model="uploaderVisible" width="400">
                            <div slot="header" style="color:#f60;text-align:center">
                                <p id="uploader-pop-title">编辑头像</p>
                                <p id="uploader-pop-subheading">调整头像尺寸和位置</p>
                            </div>
                            <div id="avatarUploader"></div>
                            <div slot="footer">
                                <Button type="primary" long @click="onUpload">保存</Button>
                            </div>
                        </Modal>
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
    </div>
</template>

<script>
    import axios from 'axios'
    import request from '~/net/request'
    import ErrorCode from '~/constant/ErrorCode'
    import config from '~/config'
    import {trim} from '~/utils/tool'

    export default {
        name: 'editUser',
        data () {
            return {
                editIndex: [0, 0, 0, 0, 0, 0],
                success: false,
                uploaderVisible: false,
                uploadURL: config.uploadAvatar,
                croppie: null,
                file: null,
                sizeLimit: config.sizeLimit,
                sizeLimitTip: config.sizeLimitTip
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
                        user: context.user,
                        avatarURL: context.user.avatarURL
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
            onFormatError () {
                this.$Message.error({
                    duration: config.messageDuration,
                    closable: true,
                    content: '不是有效的图片格式'
                })
            },
            beforeUpload (file) {
                let self = this
                this.file = file
                if (file.size > this.sizeLimit) {
                    this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: '图片大小要小于' + this.sizeLimitTip
                    })
                    return
                }
                this.uploaderVisible = !this.uploaderVisible
                let avatarUploader = document.getElementById('avatarUploader')
                avatarUploader.innerHTML = ''
                this.croppie = null
                var reader = new FileReader()
                reader.addEventListener('load', function () {
                    setTimeout(() => {
                        let opts = {
                            url: reader.result,
                            boundary: {
                                width: 240,
                                height: 240
                            },
                            viewport: {
                                width: 160,
                                height: 160,
                                type: 'square'
                            }
                        }
                        self.croppie = new window.Croppie(avatarUploader, opts)
                    }, 200)
                })
                reader.readAsDataURL(file)
                return false
            },
            onUpload () {
                let self = this
                this.croppie && this.croppie.result('blob').then(function (blob) {
                    let form = new FormData()
                    form.append('upFile', blob, self.file.name)
                    let config = {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                    axios.post(self.uploadURL, form, config).then(res => {
                        let result = res.data
                        if (result.errNo === ErrorCode.SUCCESS) {
                            self.avatarURL = result.data.url
                            self.user.avatarURL = result.data.url
                            self.uploaderVisible = false

                            self.$store.commit('avatarURL', result.data.url)
                        } else {
                            self.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: result.msg
                            })
                        }
                    })
                })
            },
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
                    return this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: '职位不能为空'
                    })
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
                        this.$Message.success({
                            duration: config.messageDuration,
                            closable: true,
                            content: '更新信息成功'
                        })
                        this.userInfo[name] = res.data[name]
                        this.close(name, index)
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
            },
            addSchool () {
                if (!this.formCustom.school.name) {
                    return this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: '学校或教育机构名不能为空'
                    })
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
            },
            deleteSchool (id) {
                let self = this
                this.$Modal.confirm({
                    title: '删除教育经历',
                    content: '确定要删除这个教育经历?',
                    onOk () {
                        request.schoolDelete({
                            params: {
                                id: id
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.SUCCESS) {
                                let id = res.data.id
                                self.userInfo.schools = self.userInfo.schools.filter(item => item.id !== id)
                                self.$Message.success({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: '操作成功'
                                })
                            } else {
                                self.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: res.msg
                                })
                            }
                        }).catch(err => {
                            self.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: err.message || err.msg
                            })
                        })
                    },
                    onCancel () {

                    }
                })
            },
            addCareer () {
                if (!this.formCustom.career.company) {
                    return this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: '公司或组织名称不能为空'
                    })
                }
                if (!this.formCustom.career.title) {
                    return this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: '职位不能为空'
                    })
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
            },
            deleteCareer (id) {
                let self = this
                this.$Modal.confirm({
                    title: '删除职业经历',
                    content: '确定要删除这个职业经历?',
                    onOk () {
                        request.careerDelete({
                            params: {
                                id: id
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.SUCCESS) {
                                let id = res.data.id
                                self.userInfo.careers = self.userInfo.careers.filter(item => item.id !== id)
                                self.$Message.success({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: '操作成功'
                                })
                            } else {
                                self.$Message.success({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: res.msg
                                })
                            }
                        }).catch(err => {
                            self.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: err.message
                            })
                        })
                    },
                    onCancel () {

                    }
                })
            }
        },
        middleware: 'userRequired',
        mounted () {
        },
        layout: 'nosidebar',
        head () {
            return {
                title: '个人信息',
                link: [
                    { rel: 'stylesheet', href: '/styles/croppie/croppie.min.css' }
                ],
                script: [
                    { src: '/javascripts/croppie/croppie.min.js' }
                ]
            }
        }
    }
</script>

<style>
    @import '../../assets/styles/mine/index.css'
</style>

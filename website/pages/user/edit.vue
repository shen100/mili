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
                        <span class="mine-info-value" v-if="editIndex[0] === 0">未知<span class="edit-action" @click="editItem('gender', 0)"><Icon type="edit"></Icon>修改</span></span>
                        <div class="edit-item" v-else>
                            <RadioGroup v-model="formCustom.gender" size="large">
                                <Radio label="1">
                                    <span class="radio-label">男</span>
                                </Radio>
                                <Radio label="2">
                                    <span class="radio-label">女</span>
                                </Radio>
                                <Row class="button-box">
                                    <Button type="primary" class="button-seq">确定</Button>
                                    <Button type="ghost" @click="close('gender', 0)">取消</Button>
                                </Row>
                            </RadioGroup>
                        </div>
                    </div>
                    <div class="mine-info-line mine-info-edit">
                        <span class="mine-info-label">一句话介绍</span>
                        <span class="mine-info-value" v-if="editIndex[1] === 0">未知<span class="edit-action" @click="editItem('desc', 1)"><Icon type="edit"></Icon>修改</span></span>
                        <div v-else class="edit-item">
                        <Input v-model="formCustom.desc" style="width: 300px" type="textarea"></Input>
                        <Row class="button-box">
                            <Button type="primary" class="button-seq">确定</Button>
                            <Button type="ghost" @click="close('desc', 1)">取消</Button>
                        </Row>
                        </div>
                    </div>
                    <div class="mine-info-line mine-info-edit">
                        <span class="mine-info-label">所在地</span>
                        <span class="mine-info-value" v-if="editIndex[2] === 0">未知<span class="edit-action" @click="editItem('home', 2)"><Icon type="edit"></Icon>修改</span></span>
                        <div v-else class="edit-item">
                            <Input v-model="formCustom.home" style="width: 300px" type="textarea"></Input>
                            <Row class="button-box">
                                <Button type="primary" class="button-seq">确定</Button>
                                <Button type="ghost" @click="close('home', 2)">取消</Button>
                            </Row>
                        </div>
                    </div>
                    <div class="mine-info-line mine-info-edit">
                        <span class="mine-info-label">个人简介</span>
                        <span class="mine-info-value" v-if="editIndex[3] === 0">未知<span class="edit-action" @click="editItem('info', 3)"><Icon type="edit"></Icon>修改</span></span>
                        <div v-else class="edit-item">
                            <Input v-model="formCustom.info" style="width: 300px" type="textarea"></Input>
                            <Row class="button-box">
                                <Button type="primary" class="button-seq">确定</Button>
                                <Button type="ghost" @click="close('info', 3)">取消</Button>
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

    export default {
        data () {
            return {
                editIndex: [0, 0, 0, 0],
                formCustom: {
                    gender: '',
                    desc: '',
                    home: '',
                    info: ''
                },
                success: false
            }
        },
        asyncData (context) {
            return {
                user: context.user
            }
        },
        methods: {
            editItem (name, index) {
                this.editIndex[index] = 1
                this.editIndex = Array.from(this.editIndex)
            },
            close (name, index) {
                this.editIndex[index] = 0
                this.editIndex = Array.from(this.editIndex)
            }
        },
        middleware: 'userRequired',
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
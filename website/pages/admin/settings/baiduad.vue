<template>
    <div>
        <h1 class="site-settings-title">
            百度广告设置
        </h1>
        <Form ref="adForm" :model="formData" :rules="formRule" :label-width="120">
            <FormItem label="横幅1(760x90)" prop="banner760x90">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="formData.banner760x90" placeholder="请输入代码位ID"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="横幅2(760x90)" prop="banner2_760x90">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="formData.banner2_760x90" placeholder="请输入代码位ID"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="横幅3(760x90)" prop="banner3_760x90">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="formData.banner3_760x90" placeholder="请输入代码位ID"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="矩形(250x250)" prop="ad250x250">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="formData.ad250x250" placeholder="请输入代码位ID"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="其他(120x90)" prop="ad120x90">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="formData.ad120x90" placeholder="请输入代码位ID"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="移动广告1(20:3)" prop="ad20_3">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="formData.ad20_3" placeholder="请输入代码位ID"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="移动广告2(20:3)" prop="ad20_3A">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="formData.ad20_3A" placeholder="请输入代码位ID"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="开启广告" prop="allowBaiduAd">
                <Row>
                    <Col span="12">
                        <i-switch v-model="formData.allowBaiduAd">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </Col>
                </Row>
            </FormItem>
            <Form-item :label-width="0">
                <Button size="large" type="primary" @click="onSubmit">提交</Button>
            </Form-item>
        </Form>
    </div>
</template>

<script>
    import config from '~/config'
    import request from '~/net/request'
    import ErrorCode from '~/constant/ErrorCode'

    export default {
        asyncData (context) {
            return request.getSiteInfo({
                client: context.req
            }).then((res) => {
                let baiduAdConfig = res.data.baiduAdConfig
                console.log(baiduAdConfig)
                return {
                    formData: {
                        banner760x90: baiduAdConfig.banner760x90,
                        banner2_760x90: baiduAdConfig.banner2_760x90,
                        banner3_760x90: baiduAdConfig.banner3_760x90,
                        ad250x250: baiduAdConfig.ad250x250,
                        ad120x90: baiduAdConfig.ad120x90,
                        ad20_3: baiduAdConfig.ad20_3,
                        ad20_3A: baiduAdConfig.ad20_3A,
                        allowBaiduAd: !!baiduAdConfig.allowBaiduAd
                    },
                    formRule: {
                        banner760x90: [
                            { required: true, message: '请输入代码位ID', trigger: 'blur' }
                        ],
                        banner2_760x90: [
                            { required: true, message: '请输入代码位ID', trigger: 'blur' }
                        ],
                        banner3_760x90: [
                            { required: true, message: '请输入代码位ID', trigger: 'blur' }
                        ],
                        ad250x250: [
                            { required: true, message: '请输入代码位ID', trigger: 'blur' }
                        ],
                        ad120x90: [
                            { required: true, message: '请输入代码位ID', trigger: 'blur' }
                        ],
                        ad20_3: [
                            { required: true, message: '请输入代码位ID', trigger: 'blur' }
                        ],
                        ad20_3A: [
                            { required: true, message: '请输入代码位ID', trigger: 'blur' }
                        ]
                    }
                }
            })
        },
        methods: {
            onSubmit () {
                this.$refs['adForm'].validate((valid) => {
                    if (valid) {
                        let self = this
                        request.setKeyVaueConfig({
                            body: {
                                key: 'baidu_ad_config',
                                value: JSON.stringify(self.formData)
                            }
                        }).then(res => {
                            if (res.errNo === ErrorCode.ERROR) {
                                self.$Message.error({
                                    duration: config.messageDuration,
                                    closable: true,
                                    content: res.msg
                                })
                            } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                                location.href = '/signin?ref=' + encodeURIComponent(location.href)
                            } else if (res.errNo === ErrorCode.SUCCESS) {
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
                                content: err.message || err.msg
                            })
                        })
                    }
                })
                return false
            }
        },
        head () {
            return {
                title: '百度广告设置'
            }
        },
        layout: 'admin'
    }
</script>

<style>
    .site-settings-title {
        font-size: 22px;
        margin: 12px 0;
    }

    .logo-img-box {
        border: 1px #e2e2e2 solid;
        margin-bottom: 12px;
    }

    .logo-img-box img {
        width: 164px;
        height: 36px;
    }
</style>

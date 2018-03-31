<template>
    <div>
        <h1 class="site-settings-title">
            网站设置
        </h1>
        <Form ref="siteForm" :model="formData" :rules="formRule" :label-width="120">
            <FormItem label="网站名称" prop="name">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="formData.name" placeholder="请输入网站名称"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="备案号" prop="icp">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="formData.icp" placeholder="请输入备案号"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="网站标题" prop="title">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="formData.title" placeholder="请输入网站标题"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="logo" prop="logoURL">
                <Row>
                    <Col span="12">
                        <div class="logo-img-box"><img :src="formData.logoURL"></div>
                        <Upload :action="uploadURL"
                            :on-success="onUploadCallback"
                            accept="image/*"
                            :show-upload-list="false"
                            :before-upload="beforeUpload" :name="'upFile'" :format="['jpg', 'jpeg', 'png']"
                            :on-format-error="onFormatError">
                            <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
                        </Upload>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="网站关键词" prop="keywords">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="formData.keywords" placeholder="请输入网站关键词，以逗号分隔"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="网站描述" prop="description">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="formData.description" placeholder="请输入网站描述"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="百度统计" prop="bdStatsID">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="formData.bdStatsID" placeholder="请输入百度统计id"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="Luosimao" prop="luosimaoSiteKey">
                <Row>
                    <Col span="12">
                        <Input v-model.trim="formData.luosimaoSiteKey" placeholder="请输入Luosimao site key"></Input>
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
                let siteConfig = res.data.siteConfig
                return {
                    uploadURL: config.uploadURL,
                    formData: {
                        name: siteConfig.name,
                        icp: siteConfig.icp,
                        title: siteConfig.title,
                        keywords: siteConfig.keywords,
                        description: siteConfig.description,
                        logoURL: siteConfig.logoURL,
                        bdStatsID: siteConfig.bdStatsID,
                        luosimaoSiteKey: siteConfig.luosimaoSiteKey
                    },
                    formRule: {
                        name: [
                            { required: true, message: '请输入网站名称', trigger: 'blur' }
                        ],
                        icp: [
                            { required: true, message: '请输入备案号', trigger: 'blur' }
                        ],
                        title: [
                            { required: true, message: '请输入网站标题', trigger: 'blur' }
                        ],
                        keywords: [
                            { required: true, message: '请输入网站关键词，以逗号分隔', trigger: 'blur' }
                        ],
                        description: [
                            { required: true, message: '请输入网站描述', trigger: 'blur' }
                        ],
                        logoURL: [
                            { required: true, message: '请上传网站logo', trigger: 'blur' }
                        ],
                        bdStatsID: [
                            { required: true, message: '请输入百度统计id', trigger: 'blur' }
                        ],
                        luosimaoSiteKey: [
                            { required: true, message: '请输入Luosimao site key', trigger: 'blur' }
                        ]
                    }
                }
            })
        },
        methods: {
            beforeUpload (file) {
                if (file.size > config.sizeLimit) {
                    this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: '图片大小要小于' + config.sizeLimitTip
                    })
                }
            },
            onFormatError () {
                this.$Message.error({
                    duration: config.messageDuration,
                    closable: true,
                    content: '不是有效的图片格式'
                })
            },
            onUploadCallback (res, file) {
                if (res) {
                    if (res.errNo === ErrorCode.SUCCESS) {
                        let url = res.data.url
                        this.formData.logoURL = url
                    } else if (res.errNo === ErrorCode.ERROR) {
                        this.$Message.error({
                            duration: config.messageDuration,
                            closable: true,
                            content: res.msg
                        })
                    } else if (res.errNo === ErrorCode.LOGIN_TIMEOUT) {
                        location.href = '/signin?ref=' + encodeURIComponent(location.href)
                    }
                }
            },
            onSubmit () {
                this.$refs['siteForm'].validate((valid) => {
                    if (valid) {
                        let self = this
                        self.formData.keywords = self.formData.keywords.replace(/，/g, ',')
                        request.setKeyVaueConfig({
                            body: {
                                key: 'site_config',
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
                title: '网站设置'
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

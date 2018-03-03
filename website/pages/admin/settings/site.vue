<template>
    <div>
        <Row>
            网站设置
        </Row>
        <Form ref="siteForm" :model="formData" :rules="formRule" :label-width="120">
            <FormItem label="网站标题" prop="title">
                <Row>
                    <Col span="12">
                        <Input v-model="formData.title" placeholder="请输入网站标题"></Input>
                    </Col>
                </Row>
            </FormItem>

            <FormItem label="logo" prop="logoURL">
                <Row>
                    <Col span="12">
                        <div class="logo-img-box"><img :src="formData.logoURL"></div>
                        <Upload :action="uploadURL"
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
                        <Input v-model="formData.keywords" placeholder="请输入网站关键词，以逗号分隔"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="网站描述" prop="description">
                <Row>
                    <Col span="12">
                        <Input v-model="formData.description" placeholder="请输入网站描述"></Input>
                    </Col>
                </Row>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import config from '~/config'
    import request from '~/net/request'

    export default {
        asyncData (context) {
            return request.getSiteInfo({
                client: context.req
            }).then((res) => {
                let siteConfig = res.data.siteConfig
                return {
                    uploadURL: config.uploadURL,
                    formData: {
                        title: siteConfig.title,
                        keywords: siteConfig.keywords,
                        description: siteConfig.description,
                        logoURL: siteConfig.logoURL
                    },
                    formRule: {
                        title: [
                            { required: true, message: '请输入网站标题', trigger: 'blur' }
                        ],
                        keywords: [
                            { required: true, message: '请输入网站关键词', trigger: 'blur' }
                        ],
                        description: [
                            { required: true, message: '请输入网站描述', trigger: 'blur' }
                        ],
                        logoURL: [
                            { required: true, message: '请上传网站logo', trigger: 'blur' }
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
    .logo-img-box {
        width: 164px;
        height: 36px;
        border: 1px #e2e2e2 solid;
        margin-bottom: 12px;
    }

    .logo-img-box img {
        width: 100%;
    }
</style>

<template>
    <Row>
        <Form ref="crawlerForm" :model="formData" :rules="ruleCustom" :label-width="120">
            <FormItem v-if="isMounted" label="网页类型">
                <Row>
                    <Col>
                        <RadioGroup v-model="formData.scope">
                            <Radio label="list">文章列表URL</Radio>
                            <Radio label="page">文章URL</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
            </FormItem>
            <FormItem v-if="isMounted" label="强制抓取">
                <Row>
                    <Col>
                        <RadioGroup v-model="formData.crawlExist">
                            <Radio :label="1">是</Radio>
                            <Radio :label="0">否</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
            </FormItem>

            <FormItem label="版块">
                <Row>
                    <Col span="12">
                        <Select v-model="cateId" placeholder="请选择版块">
                            <Option :key="item.id" v-for="item in categories" :value="item.id + ''">{{item.name}}</Option>
                        </Select>
                    </Col>
                </Row>
            </FormItem>

            <template v-if="isCustom">
                <FormItem label="来源网站名称" prop="siteName">
                    <Row>
                        <Col span="12">
                            <Input v-model="formData.siteName" placeholder="请输入来源网站名称"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="来源网站URL" prop="siteURL">
                    <Row>
                        <Col span="12">
                            <Input v-model="formData.siteURL" placeholder="请输入来源网站URL"></Input>
                        </Col>
                    </Row>
                </FormItem>
            </template>

            <template v-if="isCustom && formData.scope === 'list'">
                <FormItem label="列表项选择器" prop="listItemSelector">
                    <Row>
                        <Col span="12">
                            <Input v-model="formData.listItemSelector" placeholder="请输入列表项选择器"></Input>
                        </Col>
                    </Row>
                </FormItem>

                <FormItem label="列表项标题选择器" prop="listItemTitleSelector">
                    <Row>
                        <Col span="12">
                            <Input v-model="formData.listItemTitleSelector" placeholder="请输入列表项标题选择器"></Input>
                        </Col>
                    </Row>
                </FormItem>
            </template>

            <template v-if="isCustom">
                <FormItem label="标题选择器" prop="titleSelector">
                    <Row>
                        <Col span="12">
                            <Input v-model="formData.titleSelector" placeholder="请输入标题选择器"></Input>
                        </Col>
                    </Row>
                </FormItem>

                <FormItem label="内容选择器" prop="contentSelector">
                    <Row>
                        <Col span="12">
                            <Input v-model="formData.contentSelector" placeholder="请输入内容选择器"></Input>
                        </Col>
                    </Row>
                </FormItem>
            </template>

            <FormItem :key="i" v-for="(article, i) in formData.articles" label="URL" :prop="'articles.' + i + '.url'" :rules="urlValidate">
                <Row>
                    <Col span="12">
                        <Input v-model="article.url" placeholder="请输入URL"></Input>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Row>
                    <Col span="4">
                        <Button type="dashed" long @click="onAdd" icon="plus-round">添加URL</Button>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="onSubmit">开始抓取</Button>
            </FormItem>
        </Form>
    </Row>
</template>

<script>
    import ErrorCode from '~/constant/ErrorCode'
    import request from '~/net/request'
    import config from '~/config'

    export default {

        props: ['from', 'defaultURL', 'cateId', 'categories'],

        data () {
            return {
                isMounted: false,
                isCustom: this.from === 10,
                formData: {
                    scope: 'list', // 爬单篇文章，还是列表
                    crawlExist: 0, // 已爬过的文章，是否再次爬
                    articles: [],
                    siteName: '',
                    siteURL: '',
                    listItemSelector: '',
                    listItemTitleSelector: '',
                    titleSelector: '',
                    contentSelector: ''
                },
                urlValidate: {
                    type: 'url', required: true, message: '无效的URL'
                },
                ruleCustom: {
                    siteName: [
                        { required: true, message: '来源网站名称不能为空', trigger: 'blur' }
                    ],
                    siteURL: [
                        { type: 'url', required: true, message: '无效的URL', trigger: 'blur' }
                    ],
                    listItemSelector: [
                        { required: true, message: '列表项选择器不能为空', trigger: 'blur' }
                    ],
                    listItemTitleSelector: [
                        { required: true, message: '列表项标题选择器不能为空', trigger: 'blur' }
                    ],
                    titleSelector: [
                        { required: true, message: '标题选择器不能为空', trigger: 'blur' }
                    ],
                    contentSelector: [
                        { required: true, message: '内容选择器不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted () {
            this.isMounted = true
            this.formData.articles.push({
                url: this.defaultURL
            })
        },
        methods: {
            onAdd () {
                this.formData.articles.push({
                    url: ''
                })
            },
            onSubmit () {
                this.$refs['crawlerForm'].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    let urls = []
                    for (let i = 0; i < this.formData.articles.length; i++) {
                        urls.push(this.formData.articles[i].url)
                    }

                    let reqData = {
                        scope: this.formData.scope,
                        crawlExist: !!this.formData.crawlExist,
                        urls: urls,
                        from: this.from,
                        categoryID: parseInt(this.cateId)
                    }

                    let crawl = request.crawl
                    if (this.isCustom) {
                        crawl = request.customCrawl
                        reqData.siteName = this.formData.siteName
                        reqData.siteURL = this.formData.siteURL
                        reqData.listItemSelector = this.formData.listItemSelector
                        reqData.listItemTitleSelector = this.formData.listItemTitleSelector
                        reqData.titleSelector = this.formData.titleSelector
                        reqData.contentSelector = this.formData.contentSelector
                    }

                    crawl({
                        body: reqData
                    }).then((data) => {
                        if (data.errNo === ErrorCode.ERROR) {
                            this.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: data.msg
                            })
                            return
                        }
                        this.$Message.success({
                            duration: config.messageDuration,
                            closable: true,
                            content: '抓取成功!'
                        })
                    }).catch((err) => {
                        this.$Message.error({
                            duration: config.messageDuration,
                            closable: true,
                            content: err.msg
                        })
                    })
                })
            }
        }
    }
</script>

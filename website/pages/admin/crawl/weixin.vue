<template>
    <Row>
        <h1 class="weixin-title">微信爬虫</h1>
        <Form ref="urlsForm" :model="formData" :label-width="80">
            <FormItem label="网页类型" prop="scope">
                <Row>
                    <Col>
                        <RadioGroup v-model="formData.scope">
                            <Radio label="list">文章列表URL</Radio>
                            <Radio label="page">文章URL</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="强制抓取">
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
    import request from '~/net/request'

    export default {
        layout: 'admin',

        middleware: 'adminRequired',

        data () {
            return {
                formData: {
                    scope: 'list',
                    crawlExist: 0,
                    articles: [
                        {
                            url: 'http://weixin.sogou.com/weixin?query=golang&type=2&ie=utf8&page=1'
                        }
                    ]
                },
                urlValidate: {
                    type: 'url', required: true, message: '无效的URL'
                }
            }
        },
        asyncData (context) {
            return request.getCategories({
                client: context.req
            }).then((res) => {
                console.log(res)
                let categories = res.data.categories
                return {
                    cateId: (categories && categories[0].id + '') || '',
                    categories: categories
                }
            }).catch(err => {
                console.log(err)
                context.error({ statusCode: 404, message: 'Page not found' })
            })
        },
        methods: {
            onAdd () {
                this.formData.articles.push({
                    url: ''
                })
            },
            onSubmit () {
                this.$refs['urlsForm'].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    let urls = []
                    for (let i = 0; i < this.formData.articles.length; i++) {
                        urls.push(this.formData.articles[i].url)
                    }

                    request.crawlWeixin({
                        body: {
                            scope: this.formData.scope,
                            crawlExist: !!this.formData.crawlExist,
                            urls: urls,
                            from: 1,
                            categoryID: parseInt(this.cateId)
                        }
                    }).then(() => {
                        this.$Message.success('抓取成功!')
                    }).catch((err) => {
                        this.$Message.error(err.msg)
                    })
                })
            }
        }
    }
</script>

<style>
    .weixin-title {
        font-size: 22px;
        margin: 12px 0 12px 0;
    }
</style>

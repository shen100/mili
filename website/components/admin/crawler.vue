<template>
    <Row>
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

        props: ['from', 'defaultURL', 'cateId', 'categories'],

        data () {
            return {
                formData: {
                    scope: 'list', // 爬单篇文章，还是列表
                    crawlExist: 0, // 已爬过的文章，是否再次爬
                    articles: []
                },
                urlValidate: {
                    type: 'url', required: true, message: '无效的URL'
                }
            }
        },
        mounted () {
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
                this.$refs['urlsForm'].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    let urls = []
                    for (let i = 0; i < this.formData.articles.length; i++) {
                        urls.push(this.formData.articles[i].url)
                    }

                    request.crawl({
                        body: {
                            scope: this.formData.scope,
                            crawlExist: !!this.formData.crawlExist,
                            urls: urls,
                            from: this.from,
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

<template>
    <div>
        <Card>
            <div style="width: 600px;">
                <Tabs :value="curSelect">
                    <TabPane :key="i" v-for="(site, i) in sites" :label="site.label" :name="site.from">
                        <Form :model="formDataArr[i]" :label-width="120">
                            <FormItem label="页面类型">
                                <Select v-model="formDataArr[i].pageType">
                                    <Option value="content">文章页</Option>
                                    <Option value="list">列表页</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="URL">
                                <Input type="text" v-model="formDataArr[i].url" placeholder="" />
                            </FormItem>
                            <!-- 知乎 -->
                            <FormItem v-if="formDataArr[i].pageType === 'list' && i === 1" label="示例URL">
                                <div class="example-url">{{formDataArr[i].exampleURL}}</div>
                            </FormItem>
                            <!-- 掘金 -->
                            <template v-if="formDataArr[i].pageType === 'list' && i === 4">
                                <FormItem>
                                    <div class="example-url">{{formDataArr[i].exampleURL}}</div>
                                </FormItem>
                                <FormItem label="提交数据">
                                    <Input v-model="formDataArr[i].postData" type="textarea" :rows="15" placeholder="" />
                                </FormItem>
                            </template>
                            <template v-if="formDataArr[i].pageType === 'list' && i !== 1 && i !== 4">
                                <FormItem label="列表项选择器">
                                    <Input type="text" v-model="formDataArr[i].itemSelector" placeholder="" />
                                </FormItem>
                                <FormItem label="列表项标题选择器">
                                    <Input type="text" v-model="formDataArr[i].itemTitleSelector" placeholder="" />
                                </FormItem>
                            </template>
                            <FormItem label="标题选择器">
                                <Input type="text" v-model="formDataArr[i].titleSelector" placeholder="" />
                            </FormItem>
                            <FormItem label="正文选择器">
                                <Input type="text" v-model="formDataArr[i].contentSelector" placeholder="" />
                            </FormItem>
                            <FormItem label="">
                                <Button :loading="isLoading" type="primary" @click="onSave(formDataArr[i], site.from)"
                                    size="large" style="margin-right: 20px;">抓取</Button>
                                <Button @click="onCancel" size="large">取消</Button>
                            </FormItem>
                        </Form>
                    </TabPane>
                </Tabs>
            </div>
        </Card>
    </div>
</template>

<script>
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';
import { formatYMDHMS } from '~/js/utils/date';

export default {
    data () {
        return {
            isLoading: false,
            adminPageURL: window.adminPageURL,
            curSelect: '1',
            sites: [
                {
                    label: '简书',
                    from: '1',
                },
                {
                    label: '知乎',
                    from: '2',
                },
                {
                    label: '虎嗅',
                    from: '3',
                },
                {
                    label: 'SegmentFault',
                    from: '4',
                },
                {
                    label: '掘金',
                    from: '5',
                },
                {
                    label: '自定义',
                    from: '1000',
                }
            ],
            formDataArr: [
                {
                    // 简书
                    pageType: 'content',
                    url: '',
                    itemSelector: '.note-list li',
                    itemTitleSelector: '.title',
                    titleSelector: 'header h1',
                    contentSelector: 'section article',
                    fromTemplate: `
                        <div id="mili-content-outter-footer">
                            <blockquote>
                                <p>来源: <a href="https://www.jianshu.com/" target="_blank">简书</a><br>
                                原文: <a href="{articleURL}" target="_blank">{title}</a></p>
                            </blockquote>
                        </div>
                    `,
                },
                {
                    // 知乎
                    pageType: 'content',
                    url: '',
                    exampleURL: 'https://zhuanlan.zhihu.com/api/columns/eggjs/articles?include=data%5B*%5D.comment_count',
                    itemSelector: '.Column-ArticleList .ArticleItem',
                    itemTitleSelector: 'a:first-child',
                    titleSelector: '.Post-Title',
                    contentSelector: '.Post-RichText',
                    fromTemplate: `
                        <div id="mili-content-outter-footer">
                            <blockquote>
                                <p>来源: <a href="https://www.zhihu.com" target="_blank">知乎</a><br>
                                原文: <a href="{articleURL}" target="_blank">{title}</a></p>
                            </blockquote>
                        </div>
                    `,
                },
                {
                    // 虎嗅
                    pageType: 'content',
                    url: '',
                    itemSelector: '.article-items .article-item',
                    itemTitleSelector: 'a',
                    titleSelector: '.article__title',
                    contentSelector: '.article__content',
                    fromTemplate: `
                        <div id="mili-content-outter-footer">
                            <blockquote>
                                <p>来源: <a href="https://www.huxiu.com" target="_blank">虎嗅</a><br>
                                原文: <a href="{articleURL}" target="_blank">{title}</a></p>
                            </blockquote>
                        </div>
                    `,
                },
                {
                    // SegmentFault
                    pageType: 'content',
                    url: '',
                    itemSelector: '.stream-list__item',
                    itemTitleSelector: '.title a',
                    titleSelector: '#sf-article_title a',
                    contentSelector: '.article-content',
                    fromTemplate: `
                        <div id="mili-content-outter-footer">
                            <blockquote>
                                <p>来源: <a href="https://segmentfault.com" target="_blank">SegmentFault</a><br>
                                原文: <a href="{articleURL}" target="_blank">{title}</a></p>
                            </blockquote>
                        </div>
                    `,
                },
                {
                    // 掘金
                    pageType: 'content',
                    url: '',
                    exampleURL: 'https://web-api.juejin.im/query',
                    postData: JSON.stringify({
                        operationName: '', 
                        query: '', 
                        variables: {
                            first: 20, 
                            after: '', 
                            order: 'POPULAR'
                        }, 
                        extensions: {
                            'query': {
                                "id": "21207e9ddb1de777adeaca7a2fb38030"
                            }
                        }
                    }, null, 4),
                    itemSelector: '.stream-list__item',
                    itemTitleSelector: '.title a',
                    titleSelector: 'article .article-title',
                    contentSelector: '.article-content',
                    fromTemplate: `
                        <div id="mili-content-outter-footer">
                            <blockquote>
                                <p>来源: <a href="https://juejin.im" target="_blank">掘金</a><br>
                                原文: <a href="{articleURL}" target="_blank">{title}</a></p>
                            </blockquote>
                        </div>
                    `,
                },
                {
                    // 自定义
                    pageType: 'content',
                    url: '',
                    itemSelector: '',
                    itemTitleSelector: '',
                    titleSelector: '',
                    contentSelector: '',
                    fromTemplate: `
                        <div id="mili-content-outter-footer">
                            <blockquote>
                                <p>原文: <a href="{articleURL}" target="_blank">{title}</a></p>
                            </blockquote>
                        </div>
                    `,
                }
            ]
        };
    },
    mounted() {
    },
    methods: {
        onSave(formData, from) {
            this.isLoading = true;
            const url = '/admin/crawler';
            const data = {
                ...formData,
                from: parseInt(from),
            };
            myHTTP.post(url, data).then((res) => {
                this.isLoading = false;
                if (res.data.errorCode !== ErrorCode.SUCCESS.CODE) {
                    this.$Message.error(res.data.message);
                    return;
                }
                this.$router.push(`${adminPageURL}/article/crawler/list`);
            }).catch(err => {
                this.isLoading = false;
            });
        },
        onCancel() {
            this.$router.push(`${adminPageURL}/article/crawler/list`);
        }
    },
}
</script>

<style lang="sass" scoped>
.example-url {
    word-wrap: break-word;
    word-break: break-all;
}
</style>

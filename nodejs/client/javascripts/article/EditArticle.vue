<template>
    <div class="topic-area">
        <Form ref="formValidate" :model="formValidate" :rules="ruleInline" :label-width="80">
            <Form-item label="话题名称" prop="topicName">
                <Input v-model="formValidate.topicName" placeholder="请输入话题名称" style="width: 400px"></Input>
            </Form-item>
            <Form-item label="选择版块" prop="selected">
                <Select v-model="formValidate.selected" style="width: 400px">
                    <Option :key="item.id" v-for="item in formValidate.categories" :value="item.id + ''">{{item.name}}</Option>
                </Select>
            </Form-item>
            <Form-item class="topic-content" :label-width="0" prop="content">
                <md-editor :value="formValidate.content" @change="onContentChage"></md-editor>
            </Form-item>
            <Form-item class="topic-submit" :label-width="0">
                <Button type="primary" @click="onSubmit()">提交</Button>
            </Form-item>
        </Form>
    </div>
</template>

<style>
    @import '~iview/dist/styles/iview.css';
</style>

<script>
    import editor  from '../components/editor/editor.vue';
    import Request from '../utils/Request';

    let article = jsonData.article;

    export default {
        data() {
            return {
                id: article && article.id || undefined,
                formValidate: {
                    topicName  : article && article.name || '',
                    categories : jsonData.categories,
                    selected   : article && article.categories[0].id + '' || '',
                    content    : article && article.content || '',
                },
                ruleInline: {
                    topicName: [
                        { required: true, message: '请输入话题名称', trigger: 'blur' }
                    ],
                    selected: [
                        { required: true, message: '请选择板块', trigger: 'change' }
                    ],
                    content: [
                        { required: true, message: '请输入话题内容', trigger: 'blur' }
                    ],
                }
            };
        },
        components: {
            'md-editor': editor
        },
        methods: {
            onContentChage(content) {
                this.formValidate.content = content;
            },
            onSubmit(name) {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        var self = this;
                        const requestFunc = this.id ? Request.updateArticle : Request.createArticle;
                        requestFunc({
                            id: this.id,
                            name: this.formValidate.topicName,
                            content: this.formValidate.content,
                            categories: [
                                {
                                    id: parseInt(this.formValidate.selected)
                                }
                            ]
                        })
                        .then(res => {
                            self.$Message.success('提交成功!');
                        })
                        .catch(err => {
                            self.$Message.error(err.msg);
                        });
                    } else {
                        //this.$Message.error('表单验证失败!');
                    }
                })
            }
        },
        mounted() {
           
        }
    }
</script>

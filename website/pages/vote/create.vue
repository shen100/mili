<template>
    <div>
        <div class="vote-box">
            <div class="vote-main">
                <ul class="vote-nav">
                    <li><a href="/"><span>主页</span></a></li>
                    <li class="vote-nav-sep"><span>/</span></li>
                    <li><span class="publish-label">发起投票</span></li>
                </ul>
                <div class="vote-box-wrap">
                    <div class="vote-area">
                        <vote-editor :user="user"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import VoteEditor from '~/components/vote/save'

    export default {
        data () {
            return {
                formValidate: {
                    voteName: '',
                    date: '',
                    content: '',
                    items: [
                        {
                            value: ''
                        },
                        {
                            value: ''
                        }
                    ]
                },
                ruleInline: {
                    voteName: [
                        { required: true, message: '请输入投票名称', trigger: 'blur' }
                    ],
                    date: [
                        { required: true, message: '请选择结束日期', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '请输入投票内容', trigger: 'blur' }
                    ]
                },
                dataOption: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000
                    }
                },
                success: false
            }
        },
        asyncData (context) {
            return {
                user: context.user
            }
        },
        head () {
            return {
                title: '创建投票',
                link: [
                    { rel: 'stylesheet', href: '/styles/editor/simplemde.min.css' }
                ]
            }
        },
        middleware: 'userRequired',
        layout: 'nosidebar',
        components: {
            'vote-editor': VoteEditor
        }
    }
</script>

<style>
    @import '../../assets/styles/vote/create.css';
</style>

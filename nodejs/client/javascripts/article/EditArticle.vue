<template>
    <div>
        <div class="topic-edit-header">
            <div>
                <span>话题名称:</span>
                <Input v-model="topicName" placeholder="请输入..." style="width: 300px"></Input>
            </div>
            <div>
                <span>选择版块:</span>
                <Select v-model="select1" slot="prepend" style="width: 300px">
                    <Option value="http">http://</Option>
                </Select>
            </div>
        </div>
        <md-editor></md-editor>    
    </div>
</template>

<style>
    @import '~iview/dist/styles/iview.css';
</style>

<script>
    import editor from '../components/editor/editor.vue';

    export default {
        data() {
            return {
                topicName: ''
            };
        },
        components: {
            'md-editor': editor
        },
        methods: {

        },
        mounted() {
           
        }
    }
</script>

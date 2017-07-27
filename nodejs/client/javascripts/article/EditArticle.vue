<template>
    <div>
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
            return {};
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

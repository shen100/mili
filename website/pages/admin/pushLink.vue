<template>
    <Row>
        <Row class="admin-common-line">
            <h2 class="common-title-h">提交链接</h2>
        </Row>
        <Row>
            <Row>
                <Button @click="onPushLink" type="primary">提交</Button>
            </Row>
        </Row>
    </Row>
</template>

<script>
    import request from '~/net/request'

    export default {
        layout: 'admin',
        middleware: 'adminRequired',

        head () {
            return {
                title: '提交链接'
            }
        },

        methods: {
            onPushLink () {
                request.pushToBaidu({
                    query: {
                        type: 'article'
                    }
                }).then(() => {
                    this.$Message.success('提交成功')
                }).catch((err) => {
                    this.$Message.error(err.msg)
                })
            }
        }
    }
</script>

<style>
</style>

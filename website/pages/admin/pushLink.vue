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
    import config from '~/config'

    export default {
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
                    this.$Message.success({
                        duration: config.messageDuration,
                        closable: true,
                        content: '提交成功'
                    })
                }).catch((err) => {
                    this.$Message.error({
                        duration: config.messageDuration,
                        closable: true,
                        content: err.msg
                    })
                })
            }
        },
        layout: 'admin'
    }
</script>

<style>
</style>

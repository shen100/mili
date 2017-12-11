<template>
    <Row>
        <Row class="admin-common-line">
            <h2 class="common-title-h">Golang123后台管理</h2>
        </Row>
    </Row>
</template>

<script>
    export default {
        layout: 'admin',
        middleware: 'adminRequired',

        head () {
            return {
                title: '网站概览'
            }
        }
    }
</script>

<style>
</style>

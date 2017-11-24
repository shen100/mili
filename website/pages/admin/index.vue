<template>
    <Row>
        <h1>Golang123后台管理</h1>
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

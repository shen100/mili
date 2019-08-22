<template>
    <div>
        <Table :columns="columns" :data="data"></Table>
    </div>
</template>

<script>

export default {
    data () {
        return {
            columns: [
                {
                    title: '名称',
                    key: 'name'
                },
                {
                    title: '排序',
                    key: 'order'
                },
            ],
            data: []
        };
    },
    components: {
    }
}
</script>


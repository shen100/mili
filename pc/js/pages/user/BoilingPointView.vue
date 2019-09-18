<template>
    <div>
        <BoilingPoint :editorEnable="false" />
    </div>
</template>

<script>
import BoilingPoint from '~/js/pages/boilingpoint/BoilingPoint.vue';

export default {
    methods: {
    },
    components: {
        BoilingPoint,
    }
}
</script>

<style lang="scss" scoped>
@import url(../../../styles/boilingpoint/boilingpoint.scss);
</style>
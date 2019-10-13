<template>
    <div>
        <HandBookComment v-show="currentSelect === 'star'" select="star" @change="onChange" />
        <HandBookComment v-show="currentSelect === 'comment'" select="comment" @change="onChange" />
    </div>
</template>

<script>
import HandBookComment from '~/js/components/handbook/HandBookComment.vue';

export default {
    data() {
        return {
            currentSelect: 'star',
        };
    },
    methods: {
        onChange(select) {
            if (select !== this.currentSelect) {
                this.currentSelect = select;
            }
        }
    },
    components: {
        HandBookComment,
    }
}
</script>
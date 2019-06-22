<template>
    <transition name="custom-classes-transition"
            enter-active-class="animated fadeInDown faster"
            leave-active-class="animated fadeOut">
        <div ref="tipDOM" v-if="errorTipVisible" :style="{width: width + 'px', 'margin-left': -(width / 2) + 'px'}" class="successtip-msg">
            <i style="margin-right: 4px;" class="fa fa-check-circle"></i>{{message}}
        </div>
    </transition>
</template>

<script>
export default {
    props: [
        'width'
    ],
    data: function() {
        return {
            timeoutId: 0,
            errorDisplayDur: 5000,
            errorTipVisible: false,
            message: ''
        };
    },
    methods: {
        show(message) {
            this.errorTipVisible = true;
            this.message = message;
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                this.errorTipVisible = false;
            }, this.errorDisplayDur);
        }    
    }
}
</script>


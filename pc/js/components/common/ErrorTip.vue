<template>
    <transition name="custom-classes-transition"
            enter-active-class="animated shake"
            leave-active-class="animated fadeOutUp">
        <div v-if="errorTipVisible" class="errortip-msg">{{message}}</div>
    </transition>
</template>

<script>
export default {
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


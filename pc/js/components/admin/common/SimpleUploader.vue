<template>
    <Uploader @uploading="onImgUploading" @success="onImgUploadSuccess" 
        @error="onImgUploadFail">
        <div v-if="!imgURL" class="simple-uploader-add"></div>
        <img v-else class="simple-uploader-img" :src="imgURL"/>
    </Uploader>
</template>

<script>
import Uploader from '~/js/components/common/Uploader.vue';

export default {
    props: [
        'img'
    ],

    data() {
        return {
            imgURL: this.img || '',
        };
    },
    methods: {
        onImgUploading() {
        },
        onImgUploadSuccess(imgURL) {
            this.imgURL = imgURL;
        },
        onImgUploadFail(message) {
            this.imgURL = '';
            this.$refs.errorTip.show(message);
        },
    },
    components: {
        Uploader,
    }
}
</script>

<style lang="scss" scoped>
.simple-uploader-add {
    cursor: pointer;
    width: 80px;
    height: 80px;
    position: relative;
    border-radius: 1.4px;
    border: 1px dashed #c5c5c5;
    background: #f8f8f9;
}

.simple-uploader-add:before, .simple-uploader-add:after {
    content: "";
    width: 24px;
    height: 1px;
    display: block;
    position: absolute;
    background: #c5c5c5;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.simple-uploader-add:after {
    -webkit-transform: translate(-50%, -50%) rotate(90deg);
    transform: translate(-50%, -50%) rotate(90deg);
}

.simple-uploader-img {
    width: 80px;
    height: 80px;
}
</style>
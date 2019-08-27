<template>
    <Uploader :uploadPolicy="uploadPolicy" @uploading="onImgUploading" @success="onImgUploadSuccess" 
        @error="onImgUploadFail">
        <div v-if="!imgURL" class="simple-uploader-add"></div>
        <div v-else class="preview-image">
            <div class="icon" :style="{'background-image': `url(${imgURL})`}"></div>
            <span @click="onRemove" class="delete"></span>
        </div>
    </Uploader>
</template>

<script>
import Uploader from '~/js/components/common/Uploader.vue';

export default {
    props: [
        'img',
        'uploadPolicy'
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
            this.$emit('success', this.imgURL);
        },
        onImgUploadFail(message) {
            this.imgURL = '';
            this.$refs.errorTip.show(message);
        },
        onRemove(event) {
            event.stopPropagation();
            this.imgURL = '';
            this.$emit('remove');
        },
        setImgURL(imgURL) {
            this.imgURL = imgURL;
        }
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

.preview-image {
    position: relative;
}

.simple-uploader-img {
    width: 80px;
    height: 80px;
}


.preview-image .icon {
    border-radius: 2px;
    margin: 0;
    width: 80px;
    height: 80px;
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-flex: 0 0 auto;
    flex: 0 0 auto;
    background-position: 50%;
}

.simple-uploader-img:hover {
    filter: brightness(.8);
}

.preview-image .delete {
    cursor: pointer;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 4px;
    right: 4px;
    border-radius: 50%;
    border: 1px solid #c5c5c5;
    background: rgba(0, 0, 0, 0.4);
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
}

.preview-image .delete:after, .preview-image .delete:before {
    content: "";
    width: 9.6px;
    height: 1px;
    display: block;
    position: absolute;
    background: #fff;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.preview-image .delete:after {
    -webkit-transform: translate(-50%, -50%) rotate(90deg);
    transform: translate(-50%, -50%) rotate(90deg);
}
</style>
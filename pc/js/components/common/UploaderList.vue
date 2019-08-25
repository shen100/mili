<template>
    <div class="uploader-list-box">
        <ErrorTip ref="errorTip" />
        <div :key="i" :id="img" v-for="(img, i) in imgs" class="preview-image preview-image">
            <div class="lazy icon loaded immediate" :style="{'background-image': `url(${img})`}"></div>
            <span @click="onRemove(i)" class="delete"></span>
        </div>
        <Uploader v-if="uploadAllowed" @uploading="onImgUploading" @success="onImgUploadSuccess" 
            @error="onImgUploadFail">
            <div class="select-box"></div>
        </Uploader>
    </div>
</template>

<script>
import Uploader from '~/js/components/common/Uploader.vue';
import ErrorTip from '~/js/components/common/ErrorTip.vue';

export default {
    props: [
        'uploadAllowed'
    ],
    data () {
        return {
            imgs: []
        }
    },
    methods: {
        addImg(imgURL) {
            this.imgs.push(imgURL);
        },
        getImgs() {
            return this.imgs.slice(0);
        },
        onImgUploading() {
        },
        onImgUploadSuccess(imgURL) {
            this.imgs.push(imgURL);
            this.$emit('success');
        },
        onImgUploadFail(message) {
            this.$refs.errorTip.show(message);
        },
        onRemove(index) {
            const imgURL = this.imgs.splice(index, 1);
            this.$emit('remove', imgURL);
        }
    },
    components: {
        Uploader,
        ErrorTip,
    }
}
</script>

<style lang="scss">
.uploader-list-box {
    border-radius: 0;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    background: #f9fafb;
    border: 1px solid #dcdcdc;
    border-top: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 15px;
    padding-top: 5px;
    position: relative;
}

.preview-image {
    position: relative;
    cursor: pointer;
}

.preview-image .icon {
    border-radius: 2px;
    margin: 0 8px 8px 0;
    width: 80px;
    height: 80px;
    background-repeat: no-repeat;
    background-size: cover;
    flex: 0 0 auto;
    background-position: 50%;
}

.preview-image .delete {
    cursor: pointer;
    width: 24px;
    height: 24px;
    position: absolute;
    top: 4px;
    right: 12px;
    border-radius: 50%;
    border: 1px solid #c5c5c5;
    background: rgba(0, 0, 0, .4);
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
    transform: translate(-50%, -50%);
}

.preview-image .delete:after {
    transform: translate(-50%, -50%) rotate(90deg);
}

.uploader-list-box .select-box {
    cursor: pointer;
    width: 80px;
    height: 80px;
    position: relative;
    border-radius: 1.4px;
    border: 1px dashed #c5c5c5;
    background: #f8f8f9;
}

.uploader-list-box .select-box:after, .uploader-list-box .select-box:before {
    content: "";
    width: 24px;
    height: 1px;
    display: block;
    position: absolute;
    background: #c5c5c5;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.uploader-list-box .select-box:after {
    transform: translate(-50%, -50%) rotate(90deg);
}
</style>


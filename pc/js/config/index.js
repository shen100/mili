const uploadImgMaxSize = 2;

export default {
    upload: {
        format: ['jpg', 'jpeg', 'png', 'gif'],
        maxSize: uploadImgMaxSize,
        maxSizeError: `图片大小要小于${uploadImgMaxSize}M`
    }
};
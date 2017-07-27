<template>
	<div>
		<textarea ref="textarea"></textarea>
		<Modal v-model="modalVisible"
	        title="上传图片"
	        @on-ok="ok"
	        @on-cancel="cancel">
	        <Upload :on-success="onUploadSuccess" :name="'upFile'" :action="uploadURL">
		        <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
		    </Upload>
	    </Modal>
	</div>
</template>

<script>
	import Simplemde from './simplemde.js';

	export default {
        data() {
            return {
            	host: pageConfig.host,
            	simplemde: null,
            	uploadURL: pageConfig.apiPath + '/upload',
                modalVisible: false,
                toolbar: [
					{
			            name: "bold",
			            action: SimpleMDE.toggleBold,
			            className: "fa fa-bold",
			            title: "Bold",
			        },
			        {
			            name: "italic",
			            action: SimpleMDE.toggleItalic,
			            className: "fa fa-bold",
			            title: "Bold",
			        },
			        'preview',
			        {
			            name: "image",
			            action: this.showUpload,
			            className: "fa fa-picture-o",
			            title: "上传图片"
			        },
			        "|", // Separator
			    ]
            }
        },
        methods: {
        	ok() {
                this.$Message.info('点击了确定');
            },
            cancel() {
                this.$Message.info('点击了取消');
            },
            showUpload() {
            	console.log(111111)
            	this.modalVisible = true;
            },
            onUploadSuccess(res, file) {
            	console.log(res, file);
            	if (res && res.data && !res.data.errNo) {
            		var url = 'https://' + this.host + res.data.url;
            		console.log(SimpleMDE);
            		console.log(this.simplemde);
            		this.simplemde.setImageURL(url);
           			SimpleMDE.drawImage(this.simplemde);
            	}
            }
        },
        mounted() {
        	this.$nextTick(function() {
        		var simplemde = new SimpleMDE({
					element: this.$refs.textarea,
					promptURLs: false,
					// insertTexts: {
				 //        image: ["![](https://", ")"],
				 //    },
					toolbar: this.toolbar
				});

				this.simplemde = simplemde;

				console.log(SimpleMDE.prototype.imageURL);

				var pt = SimpleMDE.prototype;
				if (!pt.getImageURL) {
					pt.getImageURL = function() {
						console.log(this.imageURL);
						return this.imageURL;
					};
					pt.setImageURL = function(url) {
						this.imageURL = url;
					};
				}
        	});
        }
    }
</script>
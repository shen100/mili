<template>
	<div>
		<textarea ref="textarea"></textarea>
		<Modal v-model="modal"
	        title="普通的Modal对话框标题"
	        @on-ok="ok"
	        @on-cancel="cancel">
	        <Upload :on-success="onUploadSuccess" action="//jsonplaceholder.typicode.com/posts/">
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
                modal: false,
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
            showUpload(editor) {
            	this.modal = true;
            	console.log(editor.options.insertTexts.image);
            	editor.setImageURL(url);
            	SimpleMDE.drawImage(editor);
            },
            onUploadSuccess(res, file) {
            	console.log(res, file);
            }
        },
        mounted() {
        	var simplemde = new SimpleMDE({
				element: this.$refs.textarea,
				//promptURLs: true,
				insertTexts: {
			        image: ["![](https://", ")"],
			    },
				toolbar: toolbar
			});

			var pt = SimpleMDE.proptype;
			if (!pt.getImageURL) {
				pt.getImageURL = function() {
					return this.imageURL;
				};
				pt.setImageURL = function(url) {
					this.imageURL = url;
				};
			}
        }
    }
</script>
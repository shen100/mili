<template>
    <div>
        <form ref="userImgForm">
            <input ref="userImgFile" type="file" name='file'>
            <input type="submit" value="提交">
          </form>
        <img ref="userImg" src="" alt="">
    </div>
</template>

<script>
    // mounted () {
    //     let img = this.$refs.userImg
    //     let userImgFile = this.$refs.userImgFile
    //     preview;
    //     userImgFile.addEventListener('change', function () {
    //         var fr = new FileReader();
    //         fr.onload = function() {
    //             preview = this.result;
    //             img.src = preview;
    //         }
    //         fr.readAsDataURL(this.files[0])
    //     })

    //     userImgForm.addEventListener('submit', function(event) {
    //         event.preventDefault()
    //         let binaryString = atob(preview.split(',')[1])
    //         let mimeType = preview.split(',')[0].match(/:(.*?);/)[1]
    //         let length = binaryString.length
    //         let u8arr = new Uint8Array(length)
    //         let blob
    //         let fd = new FormData()
    //         let xhr = new XMLHttpRequest();
    //         while (length--) {
    //             u8arr[length] = binaryString.charCodeAt(length)
    //         }
    //         blob = new Blob([u8arr.buffer], {type: mimeType})
    //         fd.append('file', blob)
    //         xhr.open('post', '/upload')
    //         xhr.send(fd)
    //     })
    // }
</script>

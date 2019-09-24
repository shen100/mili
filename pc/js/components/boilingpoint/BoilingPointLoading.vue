<template>
    <div class="boiling-load-placeholder">
        <div class="boiling-load-img"></div>
        <div class="boiling-load-content" :style="{width: animationWidth}">
            <div class="boiling-load-name"></div>
            <div class="boiling-load-job-box">
                <div class="boiling-load-job"></div>
                <div class="boiling-load-at">@</div>
                <div class="boiling-load-company"></div>
            </div>
            <div class="boiling-htmlcontent"></div>
            <div class="boiling-topic boiling-delay"></div>
        </div>
        <div class="boiling-load-follower-btn"></div>
    </div>
</template>

<script>
export default {
    props: [
        'loadingStyle'
    ],
    data() {
        return {
            animationWidth: this.loadingStyle && this.loadingStyle.animationWidth || '350px',
        }
    }
}
</script>

<style lang="scss" scoped>
.boiling-load-placeholder {
    position: relative;
    padding: 20px;
    margin-bottom: 50px;
    overflow: hidden;
    background: #fff;
}

.boiling-load-img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 20px;
    float: left;
    background-color: #eaeaea;
}

.boiling-load-content {
    width: 350px;
    padding-top: 0;
    float: left;
}

.boiling-load-name {
    width: 90px;
    height: 16px;
    margin: 0 0 7px;
    background-color: #eaeaea;
}

.boiling-load-job-box {
    display: flex;
}

.boiling-load-job {
    width: 50px;
    height: 16px;
    background-color: #eaeaea;  
}

.boiling-load-at {
    margin-left: 5px;
    margin-right: 5px;
    color: #eaeaea;
    line-height: 16px;
}

.boiling-load-company {
    width: 50px;
    height: 16px;
    background-color: #eaeaea;  
}

.boiling-load-follower-btn {
    width: 74px;
    height: 30px;
    margin-top: 5px;
    float: right;
    background-color: #eaeaea;
}

.boiling-htmlcontent {
    height: 16px;
    margin: 7px 0;
    background-color: #eaeaea;
    -webkit-animation: loading 1s ease-in-out infinite;
    animation: loading 1s ease-in-out infinite;
}

.boiling-delay {
    -webkit-animation: loading 1s ease-in-out -.5s infinite!important;
    animation: loading 1s ease-in-out -.5s infinite!important;
}

.boiling-topic {
    width: 200px;
    height: 16px;
    background-color: #eaeaea;
    -webkit-animation: loading 1s ease-in-out infinite;
    animation: loading 1s ease-in-out infinite;
}
</style>
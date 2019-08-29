<template>
    <EditorMenuBar :editor="editor">
        <div v-clickoutside="onClickOutside" class="helloman" slot-scope="{ commands, }">
            <template v-if="false">
                <a @click="switchEmojiVisible" class="emoji">
                    <i class="iconfont ic-comment-emotions"></i>
                </a>
            </template>
            <template>
                <a @click="switchEmojiVisible" class="boilingpoint">
                    <i class="iconfont ic-comment-emotions"></i>
                    <div class="label">表情</div>
                </a>
                <a class="up-img" :class="{'not-allowed': !uploadAllowed}">
                    <Uploader v-if="uploadAllowed" @uploading="onImgUploading" @success="onImgUploadSuccess" 
                        @error="onImgUploadFail">
                        <template>
                            <i class="iconfont ic-picture"></i>       
                            <div class="label">图片</div>  
                        </template>   
                    </Uploader>
                    <template v-else>
                        <i class="iconfont ic-picture not-allowed"></i>
                        <div class="label">图片</div>  
                    </template>
                </a>
                <a @click="onTopicClick" v-clickoutside="onCloseTopicPopup"
                    class="topic" style="margin-left: 20px;">
                    <div class="label">#</div>
                    <div class="label" style="position: relative;">话题<BoilingPointTopicPopup @topicSelected="onTopicSelected" @close="onCloseTopicPopup" v-if="topicPopupVisible" /></div>
                </a>
            </template>
            <div v-if="emojiVisible" class="emoji-modal arrow-top">
                <ul id="emojiTab" class="emoji-nav-tabs modal-header">
                    <li @click="changeTab(index)" :class="{active: index === tabIndex}" 
                        :key="index" v-for="index in tabs"><a></a></li>
                </ul>
                <div id="emojiTabContent" class="tab-content">
                    <div class="tab-pane fade in" :class="{active: tabIndex === 0}">
                        <ul>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/smile.png`" title="smile" class="smile" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/blush.png`" title="blush" class="blush" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/smiley.png`" title="smiley" class="smiley" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/relaxed.png`" title="relaxed" class="relaxed" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/wink.png`" title="wink" class="wink" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/heart_eyes.png`" title="heart_eyes" class="heart_eyes" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/kissing_heart.png`" title="kissing_heart" class="kissing_heart" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/kissing_closed_eyes.png`" title="kissing_closed_eyes" class="kissing_closed_eyes" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/flushed.png`" title="flushed" class="flushed" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/grin.png`" title="grin" class="grin" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/relieved.png`" title="relieved" class="relieved" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/stuck_out_tongue_winking_eye.png`" title="stuck_out_tongue_winking_eye" class="stuck_out_tongue_winking_eye" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/stuck_out_tongue_closed_eyes.png`" title="stuck_out_tongue_closed_eyes" class="stuck_out_tongue_closed_eyes" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/unamused.png`" title="unamused" class="unamused" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/smirk.png`" title="smirk" class="smirk" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/sweat.png`" title="sweat" class="sweat" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/pensive.png`" title="pensive" class="pensive" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/confounded.png`" title="confounded" class="confounded" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/disappointed_relieved.png`" title="disappointed_relieved" class="disappointed_relieved" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/cold_sweat.png`" title="cold_sweat" class="cold_sweat" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/fearful.png`" title="fearful" class="fearful" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/persevere.png`" title="persevere" class="persevere" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/cry.png`" title="cry" class="cry" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/sob.png`" title="sob" class="sob" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/joy.png`" title="joy" class="joy" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/scream.png`" title="scream" class="scream" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/angry.png`" title="angry" class="angry" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/sleepy.png`" title="sleepy" class="sleepy" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/mask.png`" title="mask" class="mask" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/innocent.png`" title="innocent" class="innocent" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/yum.png`" title="yum" class="yum" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/anguished.png`" title="anguished" class="anguished" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/frowning.png`" title="frowning" class="frowning" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/hushed.png`" title="hushed" class="hushed" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/dizzy_face.png`" title="dizzy_face" class="dizzy_face" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/stuck_out_tongue.png`" title="stuck_out_tongue" class="stuck_out_tongue" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/no_mouth.png`" title="no_mouth" class="no_mouth" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/sunglasses.png`" title="sunglasses" class="sunglasses" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/sweat_smile.png`" title="sweat_smile" class="sweat_smile" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/worried.png`" title="worried" class="worried" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/+1.png`" title="+1" class="+1" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/-1.png`" title="-1" class="-1" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/clap.png`" title="clap" class="clap" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/v.png`" title="v" class="v" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/pray.png`" title="pray" class="pray" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/fist.png`" title="fist" class="fist" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/heart.png`" title="heart" class="heart" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/broken_heart.png`" title="broken_heart" class="broken_heart" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/heartbeat.png`" title="heartbeat" class="heartbeat" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/sparkling_heart.png`" title="sparkling_heart" class="sparkling_heart" /></a>
                            </li>
                        </ul>
                    </div>
                    <div class="tab-pane fade in" :class="{active: tabIndex === 1}">
                        <ul>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/cupid.png`" title="cupid" class="cupid" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/beer.png`" title="beer" class="beer" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/beers.png`" title="beers" class="beers" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/birthday.png`" title="birthday" class="birthday" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/heavy_exclamation_mark.png`" title="heavy_exclamation_mark" class="heavy_exclamation_mark" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/bangbang.png`" title="bangbang" class="bangbang" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/interrobang.png`" title="interrobang" class="interrobang" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/underage.png`" title="underage" class="underage" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/no_bicycles.png`" title="no_bicycles" class="no_bicycles" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/no_mobile_phones.png`" title="no_mobile_phones" class="no_mobile_phones" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/u7981.png`" title="u7981" class="u7981" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/up.png`" title="up" class="up" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/sunny.png`" title="sunny" class="sunny" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/moon.png`" title="moon" class="moon" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/high_brightness.png`" title="high_brightness" class="high_brightness" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/first_quarter_moon_with_face.png`" title="first_quarter_moon_with_face" class="first_quarter_moon_with_face" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/zap.png`" title="zap" class="zap" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/snowflake.png`" title="snowflake" class="snowflake" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/cloud.png`" title="cloud" class="cloud" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/tada.png`" title="tada" class="tada" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/bear.png`" title="bear" class="bear" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/cat.png`" title="cat" class="cat" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/cow.png`" title="cow" class="cow" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/dog.png`" title="dog" class="dog" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/hamster.png`" title="hamster" class="hamster" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/monkey_face.png`" title="monkey_face" class="monkey_face" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/rabbit.png`" title="rabbit" class="rabbit" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/tiger.png`" title="tiger" class="tiger" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/turtle.png`" title="turtle" class="turtle" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/whale.png`" title="whale" class="whale" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/whale2.png`" title="whale2" class="whale2" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/dolphin.png`" title="dolphin" class="dolphin" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/crocodile.png`" title="crocodile" class="crocodile" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/dragon_face.png`" title="dragon_face" class="dragon_face" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/squirrel.png`" title="squirrel" class="squirrel" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/hatching_chick.png`" title="hatching_chick" class="hatching_chick" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/hatched_chick.png`" title="hatched_chick" class="hatched_chick" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/baby_chick.png`" title="baby_chick" class="baby_chick" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/frog.png`" title="frog" class="frog" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/ant.png`" title="ant" class="ant" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/bug.png`" title="bug" class="bug" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/beetle.png`" title="beetle" class="beetle" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/ghost.png`" title="ghost" class="ghost" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/accept.png`" title="accept" class="accept" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/airplane.png`" title="airplane" class="airplane" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/alarm_clock.png`" title="alarm_clock" class="alarm_clock" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/ambulance.png`" title="ambulance" class="ambulance" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/angel.png`" title="angel" class="angel" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/apple.png`" title="apple" class="apple" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/arrows_counterclockwise.png`" title="arrows_counterclockwise" class="arrows_counterclockwise" /></a>
                            </li>
                        </ul>
                    </div>
                    <div class="tab-pane fade in" :class="{active: tabIndex === 2}">
                        <ul>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/balloon.png`" title="balloon" class="balloon" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/beginner.png`" title="beginner" class="beginner" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/bikini.png`" title="bikini" class="bikini" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/black_nib.png`" title="black_nib" class="black_nib" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/blossom.png`" title="blossom" class="blossom" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/bomb.png`" title="bomb" class="bomb" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/boom.png`" title="boom" class="boom" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/bow.png`" title="bow" class="bow" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/bread.png`" title="bread" class="bread" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/bulb.png`" title="bulb" class="bulb" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/cake.png`" title="cake" class="cake" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/cactus.png`" title="cactus" class="cactus" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/camera.png`" title="camera" class="camera" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/candy.png`" title="candy" class="candy" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/checkered_flag.png`" title="checkered_flag" class="checkered_flag" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/cherries.png`" title="cherries" class="cherries" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/cherry_blossom.png`" title="cherry_blossom" class="cherry_blossom" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/chocolate_bar.png`" title="chocolate_bar" class="chocolate_bar" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/christmas_tree.png`" title="christmas_tree" class="christmas_tree" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/clapper.png`" title="clapper" class="clapper" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/closed_umbrella.png`" title="closed_umbrella" class="closed_umbrella" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/closed_lock_with_key.png`" title="closed_lock_with_key" class="closed_lock_with_key" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/clubs.png`" title="clubs" class="clubs" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/cocktail.png`" title="cocktail" class="cocktail" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/coffee.png`" title="coffee" class="coffee" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/confetti_ball.png`" title="confetti_ball" class="confetti_ball" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/crown.png`" title="crown" class="crown" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/dancer.png`" title="dancer" class="dancer" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/dancers.png`" title="dancers" class="dancers" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/dart.png`" title="dart" class="dart" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/doughnut.png`" title="doughnut" class="doughnut" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/first_quarter_moon.png`" title="first_quarter_moon" class="first_quarter_moon" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/fries.png`" title="fries" class="fries" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/game_die.png`" title="game_die" class="game_die" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/golf.png`" title="golf" class="golf" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/guitar.png`" title="guitar" class="guitar" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/gun.png`" title="gun" class="gun" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/herb.png`" title="herb" class="herb" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/hibiscus.png`" title="hibiscus" class="hibiscus" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/high_heel.png`" title="high_heel" class="high_heel" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/hocho.png`" title="hocho" class="hocho" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/icecream.png`" title="icecream" class="icecream" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/ideograph_advantage.png`" title="ideograph_advantage" class="ideograph_advantage" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/jack_o_lantern.png`" title="jack_o_lantern" class="jack_o_lantern" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/key.png`" title="key" class="key" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/kiss.png`" title="kiss" class="kiss" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/lock.png`" title="lock" class="lock" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/lollipop.png`" title="lollipop" class="lollipop" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/mag.png`" title="mag" class="mag" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/moneybag.png`" title="moneybag" class="moneybag" /></a>
                            </li>
                        </ul>
                    </div>
                    <div class="tab-pane fade in" :class="{active: tabIndex === 3}">
                        <ul>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/bell.png`" title="bell" class="bell" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/no_bell.png`" title="no_bell" class="no_bell" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/ribbon.png`" title="ribbon" class="ribbon" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/skull.png`" title="skull" class="skull" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/snowman.png`" title="snowman" class="snowman" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/spaghetti.png`" title="spaghetti" class="spaghetti" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/sparkles.png`" title="sparkles" class="sparkles" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/strawberry.png`" title="strawberry" class="strawberry" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/sunflower.png`" title="sunflower" class="sunflower" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/sweat_drops.png`" title="sweat_drops" class="sweat_drops" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/toilet.png`" title="toilet" class="toilet" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/watermelon.png`" title="watermelon" class="watermelon" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/anger.png`" title="anger" class="anger" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/chart.png`" title="chart" class="chart" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/corn.png`" title="corn" class="corn" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/deciduous_tree.png`" title="deciduous_tree" class="deciduous_tree" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/dash.png`" title="dash" class="dash" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/dress.png`" title="dress" class="dress" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/ear_of_rice.png`" title="ear_of_rice" class="ear_of_rice" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/eyes.png`" title="eyes" class="eyes" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/fallen_leaf.png`" title="fallen_leaf" class="fallen_leaf" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/feet.png`" title="feet" class="feet" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/fishing_pole_and_fish.png`" title="fishing_pole_and_fish" class="fishing_pole_and_fish" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/hankey.png`" title="hankey" class="hankey" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/heavy_check_mark.png`" title="heavy_check_mark" class="heavy_check_mark" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/leaves.png`" title="leaves" class="leaves" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/lipstick.png`" title="lipstick" class="lipstick" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/mag_right.png`" title="mag_right" class="mag_right" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/mailbox_with_mail.png`" title="mailbox_with_mail" class="mailbox_with_mail" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/mailbox_with_no_mail.png`" title="mailbox_with_no_mail" class="mailbox_with_no_mail" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/man_with_gua_pi_mao.png`" title="man_with_gua_pi_mao" class="man_with_gua_pi_mao" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/metal.png`" title="metal" class="metal" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/mushroom.png`" title="mushroom" class="mushroom" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/musical_keyboard.png`" title="musical_keyboard" class="musical_keyboard" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/on.png`" title="on" class="on" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/arrow_right.png`" title="arrow_right" class="arrow_right" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/arrow_left.png`" title="arrow_left" class="arrow_left" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/arrow_up.png`" title="arrow_up" class="arrow_up" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/arrow_down.png`" title="arrow_down" class="arrow_down" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/atm.png`" title="atm" class="atm" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/crystal_ball.png`" title="crystal_ball" class="crystal_ball" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/eight_spoked_asterisk.png`" title="eight_spoked_asterisk" class="eight_spoked_asterisk" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/octocat.png`" title="octocat" class="octocat" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/crying_cat_face.png`" title="crying_cat_face" class="crying_cat_face" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/heart_eyes_cat.png`" title="heart_eyes_cat" class="heart_eyes_cat" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/joy_cat.png`" title="joy_cat" class="joy_cat" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/scream_cat.png`" title="scream_cat" class="scream_cat" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/smile_cat.png`" title="smile_cat" class="smile_cat" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/smiley_cat.png`" title="smiley_cat" class="smiley_cat" /></a>
                            </li>
                            <li @click="onSelectEmoji($event, commands)">
                                <a>
                                    <img :src="`${imgPath}/emojis/smirk_cat.png`" title="smirk_cat" class="smirk_cat" /></a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </EditorMenuBar>
</template>

<script>
import { EditorMenuBar } from 'tiptap';
import Uploader from '~/js/components/common/Uploader.vue';
import BoilingPointTopicPopup from '~/js/components/boilingpoint/BoilingPointTopicPopup.vue';

export default {
    props: [
        'editor',
        'uploadAllowed'
    ],
    data () {
        return {
            imgPath: globalConfig.imgPath,
            tabIndex: 0,
            tabs: [0, 1, 2, 3],
            emojiVisible: false,
            topicPopupVisible: false, // 是否显示沸点的话题搜索框
        };
    },
    methods: {
        changeTab(index) {
            this.tabIndex = index;
        },
        onClickOutside() {
            this.emojiVisible = false;
        },
        switchEmojiVisible() {
            this.emojiVisible = !this.emojiVisible;
        },
        onSelectEmoji(event, commands) {
            const img = event.currentTarget.firstChild.firstChild;
            const imgURL = img.getAttribute('src');
            commands.image({ src: imgURL });
            this.emojiVisible = false;
        },
        onImgUploading() {
        },
        onImgUploadSuccess(imgURL) {
            console.log(imgURL);
            this.$emit('imgUploadSuccess', imgURL);
        },
        onImgUploadFail(message) {
            this.$refs.errorTip.show(message);
        },
        onTopicClick() {
            this.topicPopupVisible = !this.topicPopupVisible;
        },
        onCloseTopicPopup() {
            this.topicPopupVisible = false;
        },
        onTopicSelected(topic) {
            console.log('topicSelected????', topic);
            this.$emit('topicSelected', topic);
        }
    },
    components: {
        EditorMenuBar,
        Uploader,
        BoilingPointTopicPopup,
    },
}
</script>

<style>
.comment-editor-box .emoji-modal-wrap .emoji-modal {
    position: absolute;
    top: 50px;
    left: 0;
    width: 360px;
    border: 1px solid #d9d9d9;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
    z-index: 1050;
    left: -48px;
}

.comment-editor-box .emoji-modal-wrap .emoji-modal.arrow-top::before {
    border-bottom-color: #d9d9d9;
    left: 48px;
    top: -10px;
}

.arrow-top:after, .arrow-top:before {
    position: absolute;
    top: -10px;
    left: 45%;
    content: "";
    display: inline-block;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 9px solid transparent;
}

.comment-editor-box .emoji-modal-wrap .emoji-modal.arrow-top::after {
    border-bottom-color: #EEEEEE;
}

.comment-editor-box .arrow-top:after {
    left: 48px;
    top: -9px;
    border-bottom: 9px solid #fff;
}

.comment-editor-box .emoji-modal-wrap .modal-header {
    padding: 20px 0 10px;
    margin: 0;
    background: #EEEEEE;
    text-align: center;
    border-bottom: 1px solid #e5e5e5;
}

.comment-editor-box .emoji-modal-wrap .modal-header li {
    display: inline;
    margin: 0 5px;
    padding: 0;
    border: none;
    line-height: 20px;
}

.comment-editor-box .emoji-modal-wrap .modal-header a {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #999999;
    text-indent: -9999px;
    border-radius: 100%;
    color: #3194d0;
}

.comment-editor-box .emoji-modal-wrap .modal-header li.active a, .comment-editor-box .emoji-modal-wrap .modal-header a:hover {
    background: #2F2F2F;
}

.comment-editor-box .tab-content>.tab-pane {
    display: none;
}

.comment-editor-box .tab-content>.active {
    display: block;
}

.comment-editor-box .emoji-modal-wrap .tab-content ul {
    padding: 8px;
    margin: 0;
    list-style: none;
    user-select: none;
}

.comment-editor-box .emoji-modal-wrap .tab-content ul li {
    display: inline-block;
    padding: 5px !important;
    border-radius: 3px;
}

.comment-editor-box .emoji-modal-wrap .tab-content img {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    border: 0;
    user-select: none;
}

.comment-editor-box .boilingpoint {
    margin: 15px 0 0;
    float: left;
    margin-top: 18px;
    line-height: 22px;
}

.comment-editor-box .boilingpoint:hover {
    text-decoration: none;
}

.comment-editor-box .boilingpoint i {
    font-size: 14px;
    color: #027fff;
    display: inline-block;
    vertical-align: top;
}

.comment-editor-box .up-img {
    margin: 15px 0 0;
    float: left;
    margin-top: 18px;
    margin-left: 20px;
    line-height: 22px;
}

.comment-editor-box .up-img:hover {
    text-decoration: none;
}

.comment-editor-box .label {
    font-size: 13px;
    margin: 0 0 0 4px;
    color: #027fff;
    display: inline-block;
    vertical-align: top;
    line-height: 22px;
}

.comment-editor-box .up-img i {
    font-size: 16px;
    color: #027fff;
    display: inline-block;
    vertical-align: top;
}

.comment-editor-box .up-img .ic-picture:before {
    content: "\E6B2";
}

.comment-editor-box .topic {
    margin-top: 18px;
    float: left;
}

.comment-editor-box .topic:hover {
    text-decoration: none;
}

.comment-editor-box .not-allowed, .comment-editor-box .not-allowed .label {
    color: #aeb6c0!important;
    cursor: not-allowed;
}
</style>

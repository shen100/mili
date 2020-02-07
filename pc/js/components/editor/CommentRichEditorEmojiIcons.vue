<template>
    <div id="emojiTabContent" class="tab-content">
        <div :key="i" v-for="(icons, i) in iconTabs" class="tab-pane fade in" :class="{active: tabIndex === i}">
            <ul>
                <li :key="j" v-for="(icon, j) in icons" @click="onSelectEmoji($event)">
                    <a><img :src="icon.src" :title="icon.title" :class="[icon.title]" /></a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: ['imgPath', 'tabIndex'],
    data() {
        return {
            iconTabs: [
                [
                    {
                        "src": `${this.imgPath}/emojis/smile.png`,
                        "title": "smile"
                    },
                    {
                        "src": `${this.imgPath}/emojis/blush.png`,
                        "title": "blush"
                    },
                    {
                        "src": `${this.imgPath}/emojis/smiley.png`,
                        "title": "smiley"
                    },
                    {
                        "src": `${this.imgPath}/emojis/relaxed.png`,
                        "title": "relaxed"
                    },
                    {
                        "src": `${this.imgPath}/emojis/wink.png`,
                        "title": "wink"
                    },
                    {
                        "src": `${this.imgPath}/emojis/heart_eyes.png`,
                        "title": "heart_eyes"
                    },
                    {
                        "src": `${this.imgPath}/emojis/kissing_heart.png`,
                        "title": "kissing_heart"
                    },
                    {
                        "src": `${this.imgPath}/emojis/kissing_closed_eyes.png`,
                        "title": "kissing_closed_eyes"
                    },
                    {
                        "src": `${this.imgPath}/emojis/flushed.png`,
                        "title": "flushed"
                    },
                    {
                        "src": `${this.imgPath}/emojis/grin.png`,
                        "title": "grin"
                    },
                    {
                        "src": `${this.imgPath}/emojis/relieved.png`,
                        "title": "relieved"
                    },
                    {
                        "src": `${this.imgPath}/emojis/stuck_out_tongue_winking_eye.png`,
                        "title": "stuck_out_tongue_winking_eye"
                    },
                    {
                        "src": `${this.imgPath}/emojis/stuck_out_tongue_closed_eyes.png`,
                        "title": "stuck_out_tongue_closed_eyes"
                    },
                    {
                        "src": `${this.imgPath}/emojis/unamused.png`,
                        "title": "unamused"
                    },
                    {
                        "src": `${this.imgPath}/emojis/smirk.png`,
                        "title": "smirk"
                    },
                    {
                        "src": `${this.imgPath}/emojis/sweat.png`,
                        "title": "sweat"
                    },
                    {
                        "src": `${this.imgPath}/emojis/pensive.png`,
                        "title": "pensive"
                    },
                    {
                        "src": `${this.imgPath}/emojis/confounded.png`,
                        "title": "confounded"
                    },
                    {
                        "src": `${this.imgPath}/emojis/disappointed_relieved.png`,
                        "title": "disappointed_relieved"
                    },
                    {
                        "src": `${this.imgPath}/emojis/cold_sweat.png`,
                        "title": "cold_sweat"
                    },
                    {
                        "src": `${this.imgPath}/emojis/fearful.png`,
                        "title": "fearful"
                    },
                    {
                        "src": `${this.imgPath}/emojis/persevere.png`,
                        "title": "persevere"
                    },
                    {
                        "src": `${this.imgPath}/emojis/cry.png`,
                        "title": "cry"
                    },
                    {
                        "src": `${this.imgPath}/emojis/sob.png`,
                        "title": "sob"
                    },
                    {
                        "src": `${this.imgPath}/emojis/joy.png`,
                        "title": "joy"
                    },
                    {
                        "src": `${this.imgPath}/emojis/scream.png`,
                        "title": "scream"
                    },
                    {
                        "src": `${this.imgPath}/emojis/angry.png`,
                        "title": "angry"
                    },
                    {
                        "src": `${this.imgPath}/emojis/sleepy.png`,
                        "title": "sleepy"
                    },
                    {
                        "src": `${this.imgPath}/emojis/mask.png`,
                        "title": "mask"
                    },
                    {
                        "src": `${this.imgPath}/emojis/innocent.png`,
                        "title": "innocent"
                    },
                    {
                        "src": `${this.imgPath}/emojis/yum.png`,
                        "title": "yum"
                    },
                    {
                        "src": `${this.imgPath}/emojis/anguished.png`,
                        "title": "anguished"
                    },
                    {
                        "src": `${this.imgPath}/emojis/frowning.png`,
                        "title": "frowning"
                    },
                    {
                        "src": `${this.imgPath}/emojis/hushed.png`,
                        "title": "hushed"
                    },
                    {
                        "src": `${this.imgPath}/emojis/dizzy_face.png`,
                        "title": "dizzy_face"
                    },
                    {
                        "src": `${this.imgPath}/emojis/stuck_out_tongue.png`,
                        "title": "stuck_out_tongue"
                    },
                    {
                        "src": `${this.imgPath}/emojis/no_mouth.png`,
                        "title": "no_mouth"
                    },
                    {
                        "src": `${this.imgPath}/emojis/sunglasses.png`,
                        "title": "sunglasses"
                    },
                    {
                        "src": `${this.imgPath}/emojis/sweat_smile.png`,
                        "title": "sweat_smile"
                    },
                    {
                        "src": `${this.imgPath}/emojis/worried.png`,
                        "title": "worried"
                    },
                    {
                        "src": `${this.imgPath}/emojis/jia1.png`,
                        "title": "+1"
                    },
                    {
                        "src": `${this.imgPath}/emojis/jian1.png`,
                        "title": "-1"
                    },
                    {
                        "src": `${this.imgPath}/emojis/clap.png`,
                        "title": "clap"
                    },
                    {
                        "src": `${this.imgPath}/emojis/v.png`,
                        "title": "v"
                    },
                    {
                        "src": `${this.imgPath}/emojis/pray.png`,
                        "title": "pray"
                    },
                    {
                        "src": `${this.imgPath}/emojis/fist.png`,
                        "title": "fist"
                    },
                    {
                        "src": `${this.imgPath}/emojis/heart.png`,
                        "title": "heart"
                    },
                    {
                        "src": `${this.imgPath}/emojis/broken_heart.png`,
                        "title": "broken_heart"
                    },
                    {
                        "src": `${this.imgPath}/emojis/heartbeat.png`,
                        "title": "heartbeat"
                    },
                    {
                        "src": `${this.imgPath}/emojis/sparkling_heart.png`,
                        "title": "sparkling_heart"
                    }
                ],
                [
                    {
                        "src": `${this.imgPath}/emojis/cupid.png`,
                        "title": "cupid"
                    },
                    {
                        "src": `${this.imgPath}/emojis/beer.png`,
                        "title": "beer"
                    },
                    {
                        "src": `${this.imgPath}/emojis/beers.png`,
                        "title": "beers"
                    },
                    {
                        "src": `${this.imgPath}/emojis/birthday.png`,
                        "title": "birthday"
                    },
                    {
                        "src": `${this.imgPath}/emojis/heavy_exclamation_mark.png`,
                        "title": "heavy_exclamation_mark"
                    },
                    {
                        "src": `${this.imgPath}/emojis/bangbang.png`,
                        "title": "bangbang"
                    },
                    {
                        "src": `${this.imgPath}/emojis/interrobang.png`,
                        "title": "interrobang"
                    },
                    {
                        "src": `${this.imgPath}/emojis/underage.png`,
                        "title": "underage"
                    },
                    {
                        "src": `${this.imgPath}/emojis/no_bicycles.png`,
                        "title": "no_bicycles"
                    },
                    {
                        "src": `${this.imgPath}/emojis/no_mobile_phones.png`,
                        "title": "no_mobile_phones"
                    },
                    {
                        "src": `${this.imgPath}/emojis/u7981.png`,
                        "title": "u7981"
                    },
                    {
                        "src": `${this.imgPath}/emojis/up.png`,
                        "title": "up"
                    },
                    {
                        "src": `${this.imgPath}/emojis/sunny.png`,
                        "title": "sunny"
                    },
                    {
                        "src": `${this.imgPath}/emojis/moon.png`,
                        "title": "moon"
                    },
                    {
                        "src": `${this.imgPath}/emojis/high_brightness.png`,
                        "title": "high_brightness"
                    },
                    {
                        "src": `${this.imgPath}/emojis/first_quarter_moon_with_face.png`,
                        "title": "first_quarter_moon_with_face"
                    },
                    {
                        "src": `${this.imgPath}/emojis/zap.png`,
                        "title": "zap"
                    },
                    {
                        "src": `${this.imgPath}/emojis/snowflake.png`,
                        "title": "snowflake"
                    },
                    {
                        "src": `${this.imgPath}/emojis/cloud.png`,
                        "title": "cloud"
                    },
                    {
                        "src": `${this.imgPath}/emojis/tada.png`,
                        "title": "tada"
                    },
                    {
                        "src": `${this.imgPath}/emojis/bear.png`,
                        "title": "bear"
                    },
                    {
                        "src": `${this.imgPath}/emojis/cat.png`,
                        "title": "cat"
                    },
                    {
                        "src": `${this.imgPath}/emojis/cow.png`,
                        "title": "cow"
                    },
                    {
                        "src": `${this.imgPath}/emojis/dog.png`,
                        "title": "dog"
                    },
                    {
                        "src": `${this.imgPath}/emojis/hamster.png`,
                        "title": "hamster"
                    },
                    {
                        "src": `${this.imgPath}/emojis/monkey_face.png`,
                        "title": "monkey_face"
                    },
                    {
                        "src": `${this.imgPath}/emojis/rabbit.png`,
                        "title": "rabbit"
                    },
                    {
                        "src": `${this.imgPath}/emojis/tiger.png`,
                        "title": "tiger"
                    },
                    {
                        "src": `${this.imgPath}/emojis/turtle.png`,
                        "title": "turtle"
                    },
                    {
                        "src": `${this.imgPath}/emojis/whale.png`,
                        "title": "whale"
                    },
                    {
                        "src": `${this.imgPath}/emojis/whale2.png`,
                        "title": "whale2"
                    },
                    {
                        "src": `${this.imgPath}/emojis/dolphin.png`,
                        "title": "dolphin"
                    },
                    {
                        "src": `${this.imgPath}/emojis/crocodile.png`,
                        "title": "crocodile"
                    },
                    {
                        "src": `${this.imgPath}/emojis/dragon_face.png`,
                        "title": "dragon_face"
                    },
                    {
                        "src": `${this.imgPath}/emojis/squirrel.png`,
                        "title": "squirrel"
                    },
                    {
                        "src": `${this.imgPath}/emojis/hatching_chick.png`,
                        "title": "hatching_chick"
                    },
                    {
                        "src": `${this.imgPath}/emojis/hatched_chick.png`,
                        "title": "hatched_chick"
                    },
                    {
                        "src": `${this.imgPath}/emojis/baby_chick.png`,
                        "title": "baby_chick"
                    },
                    {
                        "src": `${this.imgPath}/emojis/frog.png`,
                        "title": "frog"
                    },
                    {
                        "src": `${this.imgPath}/emojis/ant.png`,
                        "title": "ant"
                    },
                    {
                        "src": `${this.imgPath}/emojis/bug.png`,
                        "title": "bug"
                    },
                    {
                        "src": `${this.imgPath}/emojis/beetle.png`,
                        "title": "beetle"
                    },
                    {
                        "src": `${this.imgPath}/emojis/ghost.png`,
                        "title": "ghost"
                    },
                    {
                        "src": `${this.imgPath}/emojis/accept.png`,
                        "title": "accept"
                    },
                    {
                        "src": `${this.imgPath}/emojis/airplane.png`,
                        "title": "airplane"
                    },
                    {
                        "src": `${this.imgPath}/emojis/alarm_clock.png`,
                        "title": "alarm_clock"
                    },
                    {
                        "src": `${this.imgPath}/emojis/ambulance.png`,
                        "title": "ambulance"
                    },
                    {
                        "src": `${this.imgPath}/emojis/angel.png`,
                        "title": "angel"
                    },
                    {
                        "src": `${this.imgPath}/emojis/apple.png`,
                        "title": "apple"
                    },
                    {
                        "src": `${this.imgPath}/emojis/arrows_counterclockwise.png`,
                        "title": "arrows_counterclockwise"
                    }
                ],
                [
                    {
                        "src": `${this.imgPath}/emojis/balloon.png`,
                        "title": "balloon"
                    },
                    {
                        "src": `${this.imgPath}/emojis/beginner.png`,
                        "title": "beginner"
                    },
                    {
                        "src": `${this.imgPath}/emojis/bikini.png`,
                        "title": "bikini"
                    },
                    {
                        "src": `${this.imgPath}/emojis/black_nib.png`,
                        "title": "black_nib"
                    },
                    {
                        "src": `${this.imgPath}/emojis/blossom.png`,
                        "title": "blossom"
                    },
                    {
                        "src": `${this.imgPath}/emojis/bomb.png`,
                        "title": "bomb"
                    },
                    {
                        "src": `${this.imgPath}/emojis/boom.png`,
                        "title": "boom"
                    },
                    {
                        "src": `${this.imgPath}/emojis/bow.png`,
                        "title": "bow"
                    },
                    {
                        "src": `${this.imgPath}/emojis/bread.png`,
                        "title": "bread"
                    },
                    {
                        "src": `${this.imgPath}/emojis/bulb.png`,
                        "title": "bulb"
                    },
                    {
                        "src": `${this.imgPath}/emojis/cake.png`,
                        "title": "cake"
                    },
                    {
                        "src": `${this.imgPath}/emojis/cactus.png`,
                        "title": "cactus"
                    },
                    {
                        "src": `${this.imgPath}/emojis/camera.png`,
                        "title": "camera"
                    },
                    {
                        "src": `${this.imgPath}/emojis/candy.png`,
                        "title": "candy"
                    },
                    {
                        "src": `${this.imgPath}/emojis/checkered_flag.png`,
                        "title": "checkered_flag"
                    },
                    {
                        "src": `${this.imgPath}/emojis/cherries.png`,
                        "title": "cherries"
                    },
                    {
                        "src": `${this.imgPath}/emojis/cherry_blossom.png`,
                        "title": "cherry_blossom"
                    },
                    {
                        "src": `${this.imgPath}/emojis/chocolate_bar.png`,
                        "title": "chocolate_bar"
                    },
                    {
                        "src": `${this.imgPath}/emojis/christmas_tree.png`,
                        "title": "christmas_tree"
                    },
                    {
                        "src": `${this.imgPath}/emojis/clapper.png`,
                        "title": "clapper"
                    },
                    {
                        "src": `${this.imgPath}/emojis/closed_umbrella.png`,
                        "title": "closed_umbrella"
                    },
                    {
                        "src": `${this.imgPath}/emojis/closed_lock_with_key.png`,
                        "title": "closed_lock_with_key"
                    },
                    {
                        "src": `${this.imgPath}/emojis/clubs.png`,
                        "title": "clubs"
                    },
                    {
                        "src": `${this.imgPath}/emojis/cocktail.png`,
                        "title": "cocktail"
                    },
                    {
                        "src": `${this.imgPath}/emojis/coffee.png`,
                        "title": "coffee"
                    },
                    {
                        "src": `${this.imgPath}/emojis/confetti_ball.png`,
                        "title": "confetti_ball"
                    },
                    {
                        "src": `${this.imgPath}/emojis/crown.png`,
                        "title": "crown"
                    },
                    {
                        "src": `${this.imgPath}/emojis/dancer.png`,
                        "title": "dancer"
                    },
                    {
                        "src": `${this.imgPath}/emojis/dancers.png`,
                        "title": "dancers"
                    },
                    {
                        "src": `${this.imgPath}/emojis/dart.png`,
                        "title": "dart"
                    },
                    {
                        "src": `${this.imgPath}/emojis/doughnut.png`,
                        "title": "doughnut"
                    },
                    {
                        "src": `${this.imgPath}/emojis/first_quarter_moon.png`,
                        "title": "first_quarter_moon"
                    },
                    {
                        "src": `${this.imgPath}/emojis/fries.png`,
                        "title": "fries"
                    },
                    {
                        "src": `${this.imgPath}/emojis/game_die.png`,
                        "title": "game_die"
                    },
                    {
                        "src": `${this.imgPath}/emojis/golf.png`,
                        "title": "golf"
                    },
                    {
                        "src": `${this.imgPath}/emojis/guitar.png`,
                        "title": "guitar"
                    },
                    {
                        "src": `${this.imgPath}/emojis/gun.png`,
                        "title": "gun"
                    },
                    {
                        "src": `${this.imgPath}/emojis/herb.png`,
                        "title": "herb"
                    },
                    {
                        "src": `${this.imgPath}/emojis/hibiscus.png`,
                        "title": "hibiscus"
                    },
                    {
                        "src": `${this.imgPath}/emojis/high_heel.png`,
                        "title": "high_heel"
                    },
                    {
                        "src": `${this.imgPath}/emojis/hocho.png`,
                        "title": "hocho"
                    },
                    {
                        "src": `${this.imgPath}/emojis/icecream.png`,
                        "title": "icecream"
                    },
                    {
                        "src": `${this.imgPath}/emojis/ideograph_advantage.png`,
                        "title": "ideograph_advantage"
                    },
                    {
                        "src": `${this.imgPath}/emojis/jack_o_lantern.png`,
                        "title": "jack_o_lantern"
                    },
                    {
                        "src": `${this.imgPath}/emojis/key.png`,
                        "title": "key"
                    },
                    {
                        "src": `${this.imgPath}/emojis/kiss.png`,
                        "title": "kiss"
                    },
                    {
                        "src": `${this.imgPath}/emojis/lock.png`,
                        "title": "lock"
                    },
                    {
                        "src": `${this.imgPath}/emojis/lollipop.png`,
                        "title": "lollipop"
                    },
                    {
                        "src": `${this.imgPath}/emojis/mag.png`,
                        "title": "mag"
                    },
                    {
                        "src": `${this.imgPath}/emojis/moneybag.png`,
                        "title": "moneybag"
                    }
                ],
                [
                    {
                        "src": `${this.imgPath}/emojis/bell.png`,
                        "title": "bell"
                    },
                    {
                        "src": `${this.imgPath}/emojis/no_bell.png`,
                        "title": "no_bell"
                    },
                    {
                        "src": `${this.imgPath}/emojis/ribbon.png`,
                        "title": "ribbon"
                    },
                    {
                        "src": `${this.imgPath}/emojis/skull.png`,
                        "title": "skull"
                    },
                    {
                        "src": `${this.imgPath}/emojis/snowman.png`,
                        "title": "snowman"
                    },
                    {
                        "src": `${this.imgPath}/emojis/spaghetti.png`,
                        "title": "spaghetti"
                    },
                    {
                        "src": `${this.imgPath}/emojis/sparkles.png`,
                        "title": "sparkles"
                    },
                    {
                        "src": `${this.imgPath}/emojis/strawberry.png`,
                        "title": "strawberry"
                    },
                    {
                        "src": `${this.imgPath}/emojis/sunflower.png`,
                        "title": "sunflower"
                    },
                    {
                        "src": `${this.imgPath}/emojis/sweat_drops.png`,
                        "title": "sweat_drops"
                    },
                    {
                        "src": `${this.imgPath}/emojis/toilet.png`,
                        "title": "toilet"
                    },
                    {
                        "src": `${this.imgPath}/emojis/watermelon.png`,
                        "title": "watermelon"
                    },
                    {
                        "src": `${this.imgPath}/emojis/anger.png`,
                        "title": "anger"
                    },
                    {
                        "src": `${this.imgPath}/emojis/chart.png`,
                        "title": "chart"
                    },
                    {
                        "src": `${this.imgPath}/emojis/corn.png`,
                        "title": "corn"
                    },
                    {
                        "src": `${this.imgPath}/emojis/deciduous_tree.png`,
                        "title": "deciduous_tree"
                    },
                    {
                        "src": `${this.imgPath}/emojis/dash.png`,
                        "title": "dash"
                    },
                    {
                        "src": `${this.imgPath}/emojis/dress.png`,
                        "title": "dress"
                    },
                    {
                        "src": `${this.imgPath}/emojis/ear_of_rice.png`,
                        "title": "ear_of_rice"
                    },
                    {
                        "src": `${this.imgPath}/emojis/eyes.png`,
                        "title": "eyes"
                    },
                    {
                        "src": `${this.imgPath}/emojis/fallen_leaf.png`,
                        "title": "fallen_leaf"
                    },
                    {
                        "src": `${this.imgPath}/emojis/feet.png`,
                        "title": "feet"
                    },
                    {
                        "src": `${this.imgPath}/emojis/fishing_pole_and_fish.png`,
                        "title": "fishing_pole_and_fish"
                    },
                    {
                        "src": `${this.imgPath}/emojis/hankey.png`,
                        "title": "hankey"
                    },
                    {
                        "src": `${this.imgPath}/emojis/heavy_check_mark.png`,
                        "title": "heavy_check_mark"
                    },
                    {
                        "src": `${this.imgPath}/emojis/leaves.png`,
                        "title": "leaves"
                    },
                    {
                        "src": `${this.imgPath}/emojis/lipstick.png`,
                        "title": "lipstick"
                    },
                    {
                        "src": `${this.imgPath}/emojis/mag_right.png`,
                        "title": "mag_right"
                    },
                    {
                        "src": `${this.imgPath}/emojis/mailbox_with_mail.png`,
                        "title": "mailbox_with_mail"
                    },
                    {
                        "src": `${this.imgPath}/emojis/mailbox_with_no_mail.png`,
                        "title": "mailbox_with_no_mail"
                    },
                    {
                        "src": `${this.imgPath}/emojis/man_with_gua_pi_mao.png`,
                        "title": "man_with_gua_pi_mao"
                    },
                    {
                        "src": `${this.imgPath}/emojis/metal.png`,
                        "title": "metal"
                    },
                    {
                        "src": `${this.imgPath}/emojis/mushroom.png`,
                        "title": "mushroom"
                    },
                    {
                        "src": `${this.imgPath}/emojis/musical_keyboard.png`,
                        "title": "musical_keyboard"
                    },
                    {
                        "src": `${this.imgPath}/emojis/on.png`,
                        "title": "on"
                    },
                    {
                        "src": `${this.imgPath}/emojis/arrow_right.png`,
                        "title": "arrow_right"
                    },
                    {
                        "src": `${this.imgPath}/emojis/arrow_left.png`,
                        "title": "arrow_left"
                    },
                    {
                        "src": `${this.imgPath}/emojis/arrow_up.png`,
                        "title": "arrow_up"
                    },
                    {
                        "src": `${this.imgPath}/emojis/arrow_down.png`,
                        "title": "arrow_down"
                    },
                    {
                        "src": `${this.imgPath}/emojis/atm.png`,
                        "title": "atm"
                    },
                    {
                        "src": `${this.imgPath}/emojis/crystal_ball.png`,
                        "title": "crystal_ball"
                    },
                    {
                        "src": `${this.imgPath}/emojis/eight_spoked_asterisk.png`,
                        "title": "eight_spoked_asterisk"
                    },
                    {
                        "src": `${this.imgPath}/emojis/octocat.png`,
                        "title": "octocat"
                    },
                    {
                        "src": `${this.imgPath}/emojis/crying_cat_face.png`,
                        "title": "crying_cat_face"
                    },
                    {
                        "src": `${this.imgPath}/emojis/heart_eyes_cat.png`,
                        "title": "heart_eyes_cat"
                    },
                    {
                        "src": `${this.imgPath}/emojis/joy_cat.png`,
                        "title": "joy_cat"
                    },
                    {
                        "src": `${this.imgPath}/emojis/scream_cat.png`,
                        "title": "scream_cat"
                    },
                    {
                        "src": `${this.imgPath}/emojis/smile_cat.png`,
                        "title": "smile_cat"
                    },
                    {
                        "src": `${this.imgPath}/emojis/smiley_cat.png`,
                        "title": "smiley_cat"
                    },
                    {
                        "src": `${this.imgPath}/emojis/smirk_cat.png`,
                        "title": "smirk_cat"
                    }
                ]
            ]
        };
    },
    methods: {
        onSelectEmoji(event) {
            const img = event.currentTarget.firstChild.firstChild;
            const imgURL = img.getAttribute('src');
            this.$emit('emojionSelect', imgURL);
        },
    }
}
</script>
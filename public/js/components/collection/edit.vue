<template>
    <div id="app" class="main">
        <ErrorTip ref="errorTip" />
        <h3 >{{id ? '编辑专题' : '新建专题'}}</h3>
        <div class="avatar-collection-box">
            <div class="avatar-collection">
                <img v-if="!coverURL" :src="`${imgPath}/collection/cover.png`">
                <img v-else :src="coverURL">
            </div>
            <Uploader @uploading="onImgUploading" @success="onImgUploadSuccess" 
                    @error="onImgUploadFail">
                <div class="avatar-upload-btn">上传专题封面</div>
            </Uploader>
        </div>
        <div class="form-item">
            <label>名称</label>
            <input type="text" v-model="name" name="nick-name" placeholder="填写名称，不超过50字">
        </div>
        <div class="form-item">
            <label>描述</label>
            <textarea v-model="announcement" placeholder="填写描述"></textarea>
        </div>
        <div class="form-item" style="margin-bottom: 20px;">
            <label>其他管理员</label>
            <div class="user-add">
                <div class="user-tags">
                    <div :key="`selectu-${selectU.id}`" v-for="selectU in selectUsers" class="user-tag">
                        <a href="/u/94fb48f9b99d" class="avatar">
                        <img :src="selectU.avatarURL"></a><span>{{selectU.username}}</span>
                        <a @click="onDeleteSelectUser(selectU)" class="delete"><i class="iconfont ic-unfollow"></i></a>
                    </div>
                </div>
                <input @focus="onFocusUsername" @blur="onBlurUsername" @input="onInputUsername" v-model="username" type="text" name="nick-name" placeholder="输入用户名">
                <ul v-show="userListVisible" class="dropdown-menu">
                  <li @mousedown="onSelectUser(user)" :key="`cadmin-${user.id}`" v-for="user in users"><a href="javascript:void(0);"><img :src="user.avatarURL"><span>{{user.username}}</span></a></li>
                </ul>
            </div>
        </div>
        <div class="form-item" style="margin-bottom: 5px;">
            <label>是否允许投稿</label>
            <div class="radio-btn">
                <input type="radio" v-model="allowPost" name="post" value="yes">
                <span>允许</span>
            </div>
            <div class="radio-btn">
                <input type="radio" v-model="allowPost" name="post" value="no">
                <span>不允许</span>
            </div>
        </div>
        <div class="form-item">
            <label>投稿是否需要审核</label>
            <div class="radio-btn">
                <input type="radio" v-model="postMustAudit" name="must" value="yes">
                <span>需要</span>
            </div>
            <div class="radio-btn">
                <input type="radio" v-model="postMustAudit" name="must" value="no">
                <span>不需要</span>
            </div>
        </div>
        <div @click="onCreateCollection" class="btn btn-success follow create">{{id ? '保存专题' : '创建专题'}}</div>
    </div>
</template>

<script>
import { myHTTP } from '~/js/common/net.js';
import { trim, ossResponseParse } from '~/js/utils/utils.js';
import Uploader from '~/js/components/common/Uploader.vue';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import uuid from 'uuid/v4';

export default {
    name: 'App',
    data: function() {
        let data = {
            id: window.collection.id || undefined,
            userID: window.userID,
            imgPath: window.globalConfig.imgPath,
            name: window.collection.name || '',
            announcement: window.collection.announcement || '',
            username: '',
            allowPost: window.collection.allowPost ? 'yes' : 'no',
            postMustAudit: window.collection.postMustAudit ? 'yes' : 'no',
            users: [],
            selectUsers: window.collection.admins || [],
            timeoutId: 0,
            inputingUser: false,
            coverURL: window.collection.coverURL || '',
            errorTipLabel: '',
            
        };
        for (let i = 0; i < data.selectUsers.length; i++) {
            if (data.selectUsers[i].id === data.userID) {
                data.selectUsers.splice(i, 1);
                break;
            }
        }
        return data;
    },
    methods: {
        reqUsers(username) {
            const url = `/users/fuzzy?username=${encodeURIComponent(username)}`;
            myHTTP.get(url).then((res) => {
                if (res.data.errorCode) {
                    return;
                }
                const userArr = res.data.data || [];
                this.users = userArr.filter((user) => {
                    let found = false;
                    for (let i = 0; i < this.selectUsers.length; i++) {
                        if (this.selectUsers[i].id === user.id) {
                            found = true;
                            break;
                        }
                    }
                    return found === false;
                });
            });
        },
        onInputUsername() {
            const username = trim(this.username);
            if (!username) {
                return;
            }
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
            this.timeoutId = setTimeout(() => {
                this.reqUsers(username);
            }, 300);
        },
        onFocusUsername() {
            this.inputingUser = true;
        },
        onBlurUsername(event) {
            this.inputingUser = false;
        },
        onSelectUser(user) {
            this.selectUsers.push(user);
            this.removeUser(user, this.users);
        },
        onDeleteSelectUser(user) {
            this.removeUser(user, this.selectUsers);
        },
        removeUser(user, users) {
            for (let i = 0; i < users.length; i++) {
                if (users[i].id === user.id) {
                    users.splice(i, 1);
                    break;
                }
            }
        },
        onImgUploading() {
            this.coverURL = '';
        },
        onImgUploadSuccess(imgURL) {
            this.coverURL = imgURL;
        },
        onImgUploadFail(message) {
            this.coverURL = '';
            this.$refs.errorTip.show(message);
        },
        onUploadError(message) {
            this.$refs.errorTip.show(message);
        },
        onCreateCollection() {
            const name = trim(this.name);
            if (!name) {
                this.$refs.errorTip.show('请输入名称');
                return;
            }
            if (!this.coverURL) {
                this.$refs.errorTip.show('请上传专题封面');
                return;
            }
            let url = '/collections';
            let doRequest = myHTTP.post;
            if (this.id) {
                url = `/collections/${this.id}`;
                doRequest = myHTTP.put;
            }
            let admins = this.selectUsers.map(user => user.id) || [];
            admins.unshift(this.userID);

            doRequest(url, {
                coverURL: this.coverURL,
                name: name,
                announcement: this.announcement,
                allowPost: this.allowPost === 'yes',
                postMustAudit: this.postMustAudit === 'yes',
                admins: admins
            }).then((res) => {
                res = res.data;
                if (!res.errorCode) {
                    location.href = `/collections/${res.data.id}.html`;
                    return;
                }
                this.$refs.errorTip.show(res.message);
            });
        }
    },
    computed: {
        userListVisible() {
            return this.inputingUser && this.users.length > 0;
        }
    },
    components: {
        ErrorTip,
        Uploader,
    }
};
</script>

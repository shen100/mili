import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, In, Like } from 'typeorm';
import { User, UserStatus, UserRole, UserSex } from '../entity/user.entity';
import { MyHttpException } from '../core/exception/my-http.exception';
import * as jwt from 'jsonwebtoken';
import * as SMSClient from '@alicloud/sms-sdk';
import { ConfigService } from '../config/config.service';
import * as Geetest from 'gt3-sdk';
import * as crypto from 'crypto';
import { SMSDto } from './dto/sms.dto';
import { SignUpDto } from './dto/signup.dto';
import { RedisService } from '../redis/redis.service';
import { Settings } from '../entity/settings.entity';
import { ArticleContentType } from '../entity/article.entity';
import * as moment from 'moment';
import { ListResult } from '../entity/listresult.entity';
import { ErrorCode } from '../constants/error';
import { UpdateUserInfoDto } from './dto/update-userinfo.dto';

@Injectable()
export class UserService {
    private geetestCaptcha: Geetest;

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Settings)
        private readonly settingsRepository: Repository<Settings>,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) {
        this.geetestCaptcha = new Geetest({
            geetest_id: this.configService.geetestCaptcha.geetest_id,
            geetest_key: this.configService.geetestCaptcha.geetest_key,
        });
    }

    /**
     * 返回用户公开的基本信息
     *
     * @public
     * @param {number} id 用户id
     * @returns {Promise<User>} 返回用户基本信息
     */
    async basicInfo(id: number): Promise<User | undefined> {
        const user: User | undefined = await this.userRepository.findOne({
            select: [
                'id', 'createdAt', 'username', 'articleCount',
                'commentCount', 'introduce', 'role', 'avatarURL', 'sex',
            ] as any,
            where: { id },
        });
        return user;
    }

    async detail(id: number): Promise<User> {
        return await this.userRepository.createQueryBuilder('user')
            .select(['user.id', 'user.createdAt', 'user.username', 'user.articleCount', 'user.likedCount', 'user.uLikeCount',
                'user.commentCount', 'user.job', 'user.company', 'user.introduce', 'user.personalHomePage', 'user.role',
                'user.avatarURL', 'user.sex', 'c.id', 'c.name', 'c.coverURL', 'c.creatorID',
            ])
            .leftJoin('user.collections', 'c')
            .where('user.id = :id', { id })
            .getOne();
    }

    async updateArticleCount(id: number): Promise<UpdateResult> {
        return await this.userRepository.createQueryBuilder()
            .update()
            .set({
                articleCount: () => 'article_count + 1',
            })
            .where('id = :id', { id })
            .execute();
    }

    async updateStatus(userID: number, status: UserStatus, operatorRole: UserRole): Promise<UpdateResult> {
        return await this.userRepository.createQueryBuilder()
            .update()
            .set({
                status,
            })
            .where('id = :id', { id: userID })
            .andWhere('role < :role', { role: operatorRole })
            .execute();
    }

    /**
     * 更新用户信息(头像、职位、公司、个人介绍、个人主页)
     */
    async updateUserInfo(userID: number, updateUserInfoDto: UpdateUserInfoDto): Promise<UpdateResult> {
        const updateData: any = {};
        if (typeof updateUserInfoDto.avatarURL !== 'undefined') {
            updateData.avatarURL = updateUserInfoDto.avatarURL;
        }
        if (typeof updateUserInfoDto.job !== 'undefined') {
            updateData.job = updateUserInfoDto.job;
        }
        if (typeof updateUserInfoDto.company !== 'undefined') {
            updateData.company = updateUserInfoDto.company;
        }
        if (typeof updateUserInfoDto.introduce !== 'undefined') {
            updateData.introduce = updateUserInfoDto.introduce;
        }
        if (typeof updateUserInfoDto.personalHomePage !== 'undefined') {
            updateData.personalHomePage = updateUserInfoDto.personalHomePage;
        }
        if (typeof updateUserInfoDto.username !== 'undefined') {
            updateData.username = updateUserInfoDto.username;
            const theUser: User = await this.userRepository.findOne({
                select: [ 'id'],
                where: { username: updateData.username },
            });
            if (theUser) {
                throw new MyHttpException({
                    errorCode: ErrorCode.ParamsError.CODE,
                    message: `已存在用户名为 ${updateData.username} 的用户`,
                });
            }
        }
        return await this.userRepository.update({
            id: userID,
        }, updateData);
    }

    async updatePassword(userID: number, oldPass: string, pass: string): Promise<UpdateResult> {
        const user: User = await this.userRepository.findOne({
            select: ['pass'],
            where: { id: userID },
        });
        if (!user || !this.verifyPassword(oldPass, user.pass)) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '原密码不正确',
            });
        }
        return await this.userRepository.update({
            id: userID,
        }, {
            pass: this.generateHashPassword(pass),
        });
    }

    async findByPhoneOrUsername(phone: string, login: string): Promise<User | undefined> {
        const users: Array<User> = await this.userRepository.createQueryBuilder()
            .select(['id', 'phone', 'login'])
            .where('phone = :phone', { phone })
            .orWhere('login = :login', { login })
            .limit(1)
            .execute();
        if (users && users.length) {
            return users[0];
        }
        return undefined;
    }

    async isUserNameExist(username: string) {
        const user: User | undefined = await this.userRepository.findOne({
            select: ['id'],
            where: {
                username,
            },
        });
        return !!user;
    }

    async prepareGeetestConfig(): Promise<any> {
        const self = this;
        return new Promise((resolve, reject) => {
            // 向极验申请每次验证所需的 challenge
            self.geetestCaptcha.register(null, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!data.success) {
                    reject(new MyHttpException({
                        message: '极验服务不可用',
                    }));
                }
                resolve(data);
            });
        });
    }

    async verifyGeetestCaptcha(geetestParams): Promise<boolean> {
        const self = this;
        return new Promise<boolean>((resolve, reject) => {
            const data = {
                geetest_challenge: geetestParams.geetest_challenge,
                geetest_validate: geetestParams.geetest_validate,
                geetest_seccode: geetestParams.geetest_seccode,
            };
            self.geetestCaptcha.validate(false, data, (err, success) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (!success) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }

    async sendSMSCode(phone: string): Promise<string> {
        let codeArr = _.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        codeArr = codeArr.slice(0, 6);
        const code: string = codeArr.join('');

        const accessKeyID = this.configService.aliyunSMS.accessKeyID;
        const accessKeySecret = this.configService.aliyunSMS.accessKeySecret;
        const smsClient = new SMSClient({accessKeyId: accessKeyID, secretAccessKey: accessKeySecret});
        const res = await smsClient.sendSMS({
            PhoneNumbers: phone,
            SignName: this.configService.aliyunSMS.signName,
            TemplateCode: this.configService.aliyunSMS.templateCode,
            TemplateParam: `{"code": "${code}"}`,
        });

        if (res.Code === 'OK') {

        } else if (res.Code === 'isv.BUSINESS_LIMIT_CONTROL') {

        }
        return code;
    }

    generateHashPassword(password) {
        let codeArr = _.shuffle(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']);
        codeArr = codeArr.slice(0, 10);
        const salt: string = codeArr.join('');
        return this.encryptPassword(password, salt, this.configService.server.passSalt);
    }

    private encryptPassword(password, salt, configSalt) {
        const m1 = crypto.createHash('md5');
        const pass = m1.update(password).digest('hex');
        let hash = salt + pass + configSalt;
        const m2 = crypto.createHash('md5');
        hash = salt + m2.update(hash).digest('hex');
        return hash;
    }

    verifyPassword(password, hashedPass) {
        if (!password || !hashedPass) {
            return false;
        }
        const salt = hashedPass.substr(0, 10);
        return this.encryptPassword(password, salt, this.configService.server.passSalt) === hashedPass;
    }

    async create(signupDto: SignUpDto): Promise<User> {
        const newUser = new User();
        newUser.createdAt = new Date();
        newUser.updatedAt = newUser.createdAt;
        newUser.activatedAt = newUser.createdAt;
        newUser.phone = signupDto.phone;
        newUser.username = signupDto.login.replace(/\s+/g, ''); // 用户名中不能有空格
        newUser.pass = this.generateHashPassword(signupDto.pass);
        newUser.role = UserRole.Normal;
        newUser.status = UserStatus.Actived;
        newUser.commentCount = 0;
        newUser.sex = UserSex.Unknown;
        newUser.avatarURL = `${this.configService.static.imgPath}/avatar.jpg`;
        return await this.userRepository.save(newUser);
    }

    private async generateSNSUsername(name) {
        const numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const usernames = [
            name + '_' + _.shuffle(numArr).slice(0, 4).join(''),
            name + '_' + _.shuffle(numArr).slice(0, 4).join(''),
            name + '_' + _.shuffle(numArr).slice(0, 4).join(''),
            name + '_' + _.shuffle(numArr).slice(0, 4).join(''),
        ];
        const users = await this.userRepository.find({
            select: ['id', 'username'],
            where: {
                username: In(usernames),
            },
        });
        for (const user of users) {
            for (let i = usernames.length - 1; i >= 0; i--) {
                if (user.username === usernames[i]) {
                    usernames.splice(i, 1);
                }
            }
        }
        return usernames[0];
    }

    async upsertGithubUser(githubUser): Promise<User> {
        const [ username, existUser ] = await Promise.all([
            this.generateSNSUsername(githubUser.name),
            this.userRepository.findOne({
                select: ['id'],
                where: {
                    githubID: githubUser.id,
                },
            }),
        ]);

        const newUser = new User();
        if (!existUser) {
            newUser.createdAt = new Date();
            newUser.updatedAt = newUser.createdAt;
            newUser.activatedAt = newUser.createdAt;
            newUser.username = username;
            newUser.role = UserRole.Normal;
            newUser.status = UserStatus.Actived;
            newUser.commentCount = 0;
            newUser.sex = UserSex.Unknown;
            newUser.avatarURL = githubUser.avatar_url;
            newUser.githubID = githubUser.id;
            newUser.githubLogin = githubUser.login;
            newUser.githubName = githubUser.name;
            newUser.githubAvatarURL = githubUser.avatar_url;
            await this.userRepository.save(newUser);
            return newUser;
        }
        await this.userRepository.createQueryBuilder()
            .update(User)
            .set({
                updatedAt: new Date(),
                avatarURL: githubUser.avatar_url,
                githubLogin: githubUser.login,
                githubName: githubUser.name,
                githubAvatarURL: githubUser.avatar_url,
            })
            .where('githubID = :githubID', { githubID: githubUser.id })
            .execute();
        return existUser;
    }

    async upsertWeiboUser(weiboUser): Promise<User> {
        const [ username, existUser ] = await Promise.all([
            this.generateSNSUsername(weiboUser.screen_name),
            this.userRepository.findOne({
                select: ['id'],
                where: {
                    weiboID: weiboUser.id,
                },
            }),
        ]);
        const newUser = new User();
        if (!existUser) {
            newUser.createdAt = new Date();
            newUser.updatedAt = newUser.createdAt;
            newUser.activatedAt = newUser.createdAt;
            newUser.username = username;
            newUser.role = UserRole.Normal;
            newUser.status = UserStatus.Actived;
            newUser.commentCount = 0;
            newUser.sex = UserSex.Unknown;
            newUser.avatarURL = weiboUser.avatar_large;
            newUser.weiboID = weiboUser.id;
            newUser.weiboScreenName = weiboUser.screen_name;
            newUser.weiboName = weiboUser.name;
            newUser.weiboAvatarLarge = weiboUser.avatar_large;
            await this.userRepository.save(newUser);
            return newUser;
        }
        await this.userRepository.createQueryBuilder()
            .update(User)
            .set({
                updatedAt: new Date(),
                avatarURL: weiboUser.avatar_large,
                weiboScreenName: weiboUser.screen_name,
                weiboName: weiboUser.name,
                weiboAvatarLarge: weiboUser.avatar_large,
            })
            .where('weiboID = :weiboID', { weiboID: weiboUser.id })
            .execute();
        return existUser;
    }

    async generateToken(user: User): Promise<string> {
        const tokenSecret: string = this.configService.server.tokenSecret;
        const tokenMaxAge: number = this.configService.server.tokenMaxAge;
        return new Promise<string>((resolve, reject) => {
            // HMAC using SHA-256 hash algorithm
            // token 过期时间，单位秒
            jwt.sign({
                id: user.id,
                exp: Math.floor((Date.now() + tokenMaxAge) / 1000),
            }, tokenSecret, { algorithm: 'HS256'}, (err, token) => {
                if (err) {
                    return reject(err);
                }
                resolve(token);
            });
        });
    }

    async getUser(id: number): Promise<User> {
        let user: User = await this.redisService.getUser(id);
        if (!user) {
            user = await this.userRepository.findOne({
                select: [
                    'id', 'status', 'createdAt', 'username', 'articleCount', 'collectionCount',
                    'commentCount', 'followCount', 'followerCount', 'boilingPointCount',
                    'introduce', 'role', 'avatarURL', 'sex',
                ] as any,
                where: {
                    id,
                },
            });
            await this.redisService.setUser(user);
        }
        return user;
    }

    async findUser(where, select) {
        const user = await this.userRepository.findOne({
            select,
            where,
        });
        return user;
    }

    async findOne(options): Promise<User> {
        const user = await this.userRepository.findOne({
            select: options.select,
            where: options.where,
        });
        return user;
    }

    async findUsers(where, select): Promise<User[]> {
        const users = await this.userRepository.find({
            select,
            where,
        });
        return users;
    }

    async fuzzyQueryByUsername(username: string) {
        let user: User;
        let users: Array<User>;
        [user, users] = await Promise.all([
            this.userRepository.findOne({
                select: {
                    id: true,
                    username: true,
                    avatarURL: true,
                },
                where: { username },
            }),
            this.userRepository.find({
                select: {
                    id: true,
                    username: true,
                    avatarURL: true,
                },
                where: {
                    username: Like(`${username}%`),
                },
                take: 10,
            } as any),
        ]);
        users = users || [];
        if (!user) {
            return users;
        }
        return _.unionWith(users, [user], _.isEqual);
    }

    async findSettings(userID: number) {
        const settings = await this.settingsRepository.findOne({
            where: { userID },
        });
        return settings;
    }

    async updateEditorSettings(userID: number, editorType: ArticleContentType) {
        return await this.settingsRepository.query(
            `INSERT INTO settings (user_id, editor_type)
            VALUES (${userID}, ${editorType})
            ON DUPLICATE KEY UPDATE editor_type = ${editorType}`,
        );
    }

    async isExist(id: number) {
        const user = await this.userRepository.findOne({
            id,
        }, {
            select: ['id'],
        });
        return user !== null;
    }

    // 用户关注了哪些人
    async userFollows(userID: number, page: number, pageSize): Promise<ListResult<User>> {
        const sql = `SELECT user_id FROM user_follower WHERE follower_id = ?`;
        let userIDs = await this.userRepository.manager.query(sql, [userID]) || [];
        if (!userIDs.length) {
            return {
                list: [],
                count: 0,
                page,
                pageSize,
            };
        }
        userIDs = userIDs.map(data => data.user_id);
        const count: number = userIDs.length;
        userIDs = userIDs.slice((page - 1) * pageSize, pageSize);
        const users = await this.userRepository.find({
            select: ['id', 'avatarURL', 'username', 'job', 'company'],
            where: {
                id: In(userIDs),
            },
        });
        return {
            list: users,
            count,
            page,
            pageSize,
        };
    }

    // 用户有哪些粉丝
    async userFollowers(userID: number, page: number, pageSize): Promise<ListResult<User>> {
        const sql = `SELECT follower_id FROM user_follower WHERE user_id = ?`;
        let userIDs = await this.userRepository.manager.query(sql, [userID]);
        if (!userIDs.length) {
            return {
                list: [],
                count: 0,
                page,
                pageSize,
            };
        }
        userIDs = userIDs.map(data => data.follower_id);
        const count: number = userIDs.length;
        userIDs = userIDs.slice((page - 1) * pageSize, pageSize);
        const users = await this.userRepository.find({
            select: ['id', 'avatarURL', 'username', 'job', 'company'],
            where: {
                id: In(userIDs),
            },
        });
        return {
            list: users,
            count,
            page,
            pageSize,
        };
    }

    async followOrCancelFollow(followerID: number, userID: number) {
        const sql = `DELETE FROM user_follower
                WHERE follower_id = ${followerID} AND user_id = ${userID}`;
        const subFollowCountSQL = `UPDATE users SET follow_count = follow_count - 1 WHERE id = ${followerID}`;
        const subFollowerCountSQL = `UPDATE users SET follower_count = follower_count - 1 WHERE id = ${userID}`;

        const sql2 = `INSERT INTO user_follower (follower_id, user_id, created_at)
                VALUES (${followerID}, ${userID}, "${moment(new Date()).format('YYYY.MM.DD HH:mm:ss')}")`;
        const addFollowCountSQL = `UPDATE users SET follow_count = follow_count + 1 WHERE id = ${followerID}`;
        const addFollowerCountSQL = `UPDATE users SET follower_count = follower_count + 1 WHERE id = ${userID}`;

        const userFollowed = await this.isUserFollowed(followerID, userID);

        await this.userRepository.manager.connection.transaction(async manager => {
            if (userFollowed) {
                await manager.query(sql);
                await manager.query(subFollowerCountSQL);
                await manager.query(subFollowCountSQL);
                return;
            }
            await manager.query(sql2);
            await manager.query(addFollowerCountSQL);
            await manager.query(addFollowCountSQL);
        });
    }

    async isUserFollowed(followerID: number, userID: number): Promise<boolean> {
        const sql = `SELECT follower_id, user_id FROM user_follower
            WHERE follower_id = ${followerID} AND user_id = ${userID}`;
        let result = await this.userRepository.manager.query(sql);
        result = result || [];
        if (result.length) {
            return true;
        }
        return false;
    }

    /**
     * 在一组用户中， 用户关注了哪些人
     */
    async usersFilterByFollowerID(users: number[], followerID: number) {
        if (!users || users.length <= 0) {
            return [];
        }
        const sql = `SELECT follower_id as followerID, user_id as userID FROM user_follower
            WHERE follower_id = ${followerID} AND user_id IN (${users.join(',')})`;
        return await this.userRepository.manager.query(sql);
    }

    async searchUsers(keyword: string, page: number, pageSize: number) {
        const condition = {
            username: Like(`%${keyword}%`),
        };
        const [list, count] = await Promise.all([
            this.userRepository.find({
                select: {
                    id: true,
                    username: true,
                    avatarURL: true,
                },
                where: condition,
                skip: (page - 1) * pageSize,
                take: pageSize,
            } as any),
            this.userRepository.count(condition),
        ]);
        return {
            list,
            count,
            page,
            pageSize,
        };
    }

    async randomUsers(page: number, pageSize: number) {
        const [list, count] = await Promise.all([
            this.userRepository.find({
                select: {
                    id: true,
                    username: true,
                    avatarURL: true,
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.userRepository.count(),
        ]);
        return {
            list,
            count,
            page,
            pageSize,
        };
    }
}
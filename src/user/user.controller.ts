import {
    Controller,
    Get,
    Post,
    Body,
    Res,
    Query,
    UseGuards,
    Param,
    Delete,
    Put,
} from '@nestjs/common';

import * as util from 'util';
import _ from 'lodash';
import axios from 'axios';
import { UserConstants } from '../constants/constants';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signup.dto';
import { MyHttpException } from '../core/exception/my-http.exception';
import { RedisService } from '../redis/redis.service';
import { SMSDto } from './dto/sms.dto';
import { CurUser } from '../core/decorators/user.decorator';
import { ErrorCode } from '../constants/error';
import { ConfigService } from '../config/config.service';
import { User } from '../entity/user.entity';
import { SigninDto } from './dto/signin.dto';
import { ActiveGuard } from '../core/guards/active.guard';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { APIPrefix } from '../constants/constants';
import { OSSService } from '../common/oss.service';
import { CreateArticleDto } from '../cms/dto/create-article.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
        private readonly ossService: OSSService,
    ) {}

    @Get('/settings/:html')
    async settingsView(@CurUser() user, @Param('html') html: string, @Res() res) {
        if (['profile', 'password'].indexOf(html) < 0) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        const [uploadPolicy] = await Promise.all([
            this.ossService.requestPolicy(),
        ]);
        return res.render('pages/settings/settings', {
            user,
            uploadPolicy,
        });
    }

    @Get('/signup.html')
    async signupHTML(@CurUser() user, @Res() res) {
        // 如果已登录，那么跳到首页
        if (user) {
            res.redirect('/');
            return;
        }
        return res.render('pages/signup');
    }

    @Get('/signin.html')
    async signinHTML(@CurUser() user, @Res() res) {
        // 如果已登录，那么跳到首页
        if (user) {
            res.redirect('/');
            return;
        }
        return res.render('pages/signin');
    }

    @Get('/users/signin/github.html')
    async githubSignin(@Res() res) {
        const authorizeURL = this.configService.github.authorizeURL;
        const clientID = this.configService.github.clientID;
        res.status(302);
        res.redirect(util.format(authorizeURL, clientID));
    }

    @Get('/users/signup/github.html')
    async githubSignup(@Res() res) {
        const authorizeURL = this.configService.github.authorizeURL;
        const clientID = this.configService.github.clientID;
        res.status(302);
        res.redirect(util.format(authorizeURL, clientID));
    }

    @Get('/users/auth/github/callback.html')
    async githubAuthCallback(@Query('code') code: string, @Res() res) {
        if (!code) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
        const result = await axios.post(this.configService.github.accessTokenURL, {
            client_id: this.configService.github.clientID,
            client_secret: this.configService.github.clientSecret,
            code,
        }, {
            headers: { Accept: 'application/json' },
        });

        if (!(result.status === 200 && !result.data.error)) {
            res.status(302);
            res.redirect('/signup.html');
            return;
        }

        const userInfoURL = util.format(this.configService.github.userInfoURL, result.data.access_token);
        const userResult = await axios.get(userInfoURL, {
            headers: { Accept: 'application/json' },
        });

        if (!(userResult.status === 200 && !userResult.data.error)) {
            res.status(302);
            res.redirect('/signup.html');
            return;
        }

        const user: User = await this.userService.upsertGithubUser(userResult.data);
        await this.setToken(res, user);
        res.status(302);
        res.redirect('/');
    }

    @Get('/users/signup/weibo.html')
    async weiboSignin(@Res() res) {
        const authorizeURL = this.configService.weibo.authorizeURL;
        const appKey = this.configService.weibo.appKey;
        const state = this.configService.weibo.state;
        const redirectURL = this.configService.weibo.redirectURL;
        // https://open.weibo.com/wiki/%E6%8E%88%E6%9D%83%E6%9C%BA%E5%88%B6
        res.status(302);
        res.redirect(util.format(authorizeURL, state, appKey, redirectURL));
    }

    @Get('/users/signup/weibo.html')
    async weiboSignup(@Res() res) {
        const authorizeURL = this.configService.weibo.authorizeURL;
        const appKey = this.configService.weibo.appKey;
        const state = this.configService.weibo.state;
        const redirectURL = this.configService.weibo.redirectURL;
        // https://open.weibo.com/wiki/%E6%8E%88%E6%9D%83%E6%9C%BA%E5%88%B6
        res.status(302);
        res.redirect(util.format(authorizeURL, state, appKey, redirectURL));
    }

    @Get('/users/auth/weibo/callback.html')
    async weiboAuthCallback(@Query('code') code: string, @Query('state') state: string, @Res() res) {
        if (state !== this.configService.weibo.state) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
        if (!code) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
        const accessTokenURL = this.configService.weibo.accessTokenURL;
        const appKey = this.configService.weibo.appKey;
        const appSecret = this.configService.weibo.appSecret;
        const redirectURL = this.configService.weibo.redirectURL;
        const result = await axios.post(util.format(accessTokenURL, appKey, appSecret, redirectURL, code));

        if (!(result.status === 200 && result.data.access_token)) {
            res.status(302);
            res.redirect('/signup.html');
            return;
        }

        // https://open.weibo.com/wiki/2/users/show
        const userInfoURL = util.format(this.configService.weibo.userInfoURL, result.data.access_token, result.data.uid);
        const userResult = await axios.get(userInfoURL);

        if (!(userResult.status === 200 && userResult.data.id)) {
            res.status(302);
            res.redirect('/signup.html');
            return;
        }

        const user: User = await this.userService.upsertWeiboUser(userResult.data);
        await this.setToken(res, user);
        res.status(302);
        res.redirect('/');
    }

    @Get('/api/v1/users/geetestconfig')
    async prepareGeetestConfig() {
        const data = await this.userService.prepareGeetestConfig();
        return data;
    }

    @Post('/api/v1/users/smscode')
    async sendSMSCode(@Body() smsDto: SMSDto) {
        const verifyResult: boolean = await this.userService.verifyGeetestCaptcha(smsDto);
        if (!verifyResult) {
            throw new MyHttpException({
                errorCode: ErrorCode.InvalidCaptcha.CODE,
                message: '验证码错误',
            });
        }
        const code: string = await this.userService.sendSMSCode(smsDto.phone);
        this.redisService.setSignupCode(smsDto.phone, code);
        return {};
    }

    @Post('/api/v1/users/signup')
    async signup(@Body() signupDto: SignUpDto, @Res() res) {
        if (signupDto.login.indexOf('@') >= 0) {
            throw new MyHttpException({
                errorCode: ErrorCode.InvalidUserName.CODE,
            });
        }
        const code: string = await this.redisService.getSignupCode(signupDto.phone);
        if (code !== signupDto.code) {
            throw new MyHttpException({
                errorCode: ErrorCode.InvalidCaptcha.CODE,
            });
        }

        const existUser = await this.userService.findByPhoneOrUsername(signupDto.phone, signupDto.login);
        if (existUser) {
            if (existUser.phone === signupDto.phone) {
                throw new MyHttpException({
                    errorCode: ErrorCode.PhoneExists.CODE,
                });
            }
            throw new MyHttpException({
                errorCode: ErrorCode.UserNameExists.CODE,
            });
        }

        const user: User = await this.userService.create(signupDto);
        const cacheKey = util.format(this.redisService.cacheKeys.signupCode, signupDto.phone);
        this.redisService.delCache(cacheKey);

        await this.setToken(res, user);
        res.json({
            errorCode: ErrorCode.SUCCESS.CODE,
            data: { id: user.id },
        });
    }

    async setToken(@Res() res, user: User) {
        const token: string = await this.userService.generateToken(user);
        const tokenMaxAge: number = this.configService.server.tokenMaxAge;
        await this.redisService.setUserToken(user.id, token);

        const secure = this.configService.server.url.indexOf('https') === 0;

        res.cookie(this.configService.server.tokenName, token, {
            maxAge: tokenMaxAge, // Convenient option for setting the expiry time relative to the current time in milliseconds
            secure,
            domain: '',
            path: '/',
            httpOnly: true,
        });
    }

    @Post('/api/v1/users/signin')
    async signin(@Body() signinDto: SigninDto, @Res() res) {
        const verifyResult: boolean = await this.userService.verifyGeetestCaptcha(signinDto);
        if (!verifyResult) {
            throw new MyHttpException({
                errorCode: ErrorCode.InvalidCaptcha.CODE,
                message: '验证码错误',
            });
        }
        let user: User | undefined;
        if (signinDto.verifyType === 'phone') {
            user = await this.userService.findUser({ phone: signinDto.login }, { id: true, pass: true });
        } else if (signinDto.verifyType === 'email') {
            user = await this.userService.findUser({ email: signinDto.login }, { id: true, pass: true });
        }
        if (!user || !this.userService.verifyPassword(signinDto.password, user.pass)) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '手机号码/邮箱地址或密码不正确',
            });
        }
        await this.setToken(res, user);
        res.json({
            errorCode: ErrorCode.SUCCESS.CODE,
            data: { id: user.id },
        });
    }

    @Get('/api/v1/users/fuzzy')
    async fuzzyQueryByUsername(@Query('username') username: string) {
        if (!username || username.length > UserConstants.USERNAME_MAX_LENGTH) {
            return [];
        }
        username = decodeURIComponent(username);
        const users: Array<User> = await this.userService.fuzzyQueryByUsername(username);
        return users;
    }

    // 用户关注了哪些人
    @Get(`${APIPrefix}/users/:id/follows`)
    async userFollows(@Param('id', MustIntPipe) id: number) {
        return await this.userService.userFollows(id, 1, 20);;
    }

    // 用户有哪些粉丝
    @Get(`${APIPrefix}/users/:id/followers`)
    async userFollowers(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        const listResult = await this.userService.userFollowers(id, 1, 20);
        if (user) {
            const users = listResult.list.map(u => u.id);
            const followedUsers = await this.userService.usersFilterByFollowerID(users, user.id);
            const userFollowedMap = {};
            followedUsers.forEach(followedUser => {
                userFollowedMap[followedUser.userID] = true;
            });
            listResult.list.forEach((userData: any) => {
                userData.isFollowed = !!userFollowedMap[userData.id];
            });
        }
        return listResult;
    }

    @Post(`${APIPrefix}/users/:userID/follow`)
    @UseGuards(ActiveGuard)
    async follow(@CurUser() user, @Param('userID', MustIntPipe) userID: number) {
        const isUserExist: boolean = await this.userService.isExist(userID);
        if (!isUserExist) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        await this.userService.followOrCancelFollow(user.id, userID);
        await Promise.all([
            await this.redisService.delCache(util.format(this.redisService.cacheKeys.user, user.id)),
            await this.redisService.delCache(util.format(this.redisService.cacheKeys.user, userID)),
        ]);
        return {};
    }

    @Delete(`${APIPrefix}/users/:userID/follow`)
    @UseGuards(ActiveGuard)
    async cancelFollow(@CurUser() user, @Param('userID', MustIntPipe) userID: number) {
        const isUserExist: boolean = await this.userService.isExist(userID);
        if (!isUserExist) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        await this.userService.followOrCancelFollow(user.id, userID);
        await Promise.all([
            await this.redisService.delCache(util.format(this.redisService.cacheKeys.user, user.id)),
            await this.redisService.delCache(util.format(this.redisService.cacheKeys.user, userID)),
        ]);
        return {};
    }

    @Put(`${APIPrefix}/users/avatar`)
    @UseGuards(ActiveGuard)
    async updateAvatar(@CurUser() user, @Body() updateAvatarDto: UpdateAvatarDto) {
        await this.userService.updateAvatar(user.id, updateAvatarDto.avatarURL);
        const cacheKey = util.format(this.redisService.cacheKeys.user, user.id);
        this.redisService.delCache(cacheKey);
        return {};
    }
}
import { Injectable, NestMiddleware, MiddlewareFunction, HttpException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../../config/config.service';
import { RedisService } from '../../redis/redis.service';
import { ErrorCode } from '../../constants/error';
import { User } from '../../entity/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly userService: UserService,
    ) {}

    async resolve(): Promise<MiddlewareFunction> {
        return async (req, res, next) => {
            const tokenName: string = this.configService.server.tokenName;
            const tokenSecret: string = this.configService.server.tokenSecret;
            const token: string = req.cookies[tokenName] || '';
            if (!token) {
                next();
                return;
            }
            jwt.verify(token, tokenSecret, { algorithms: ['HS256'] }, async (err, payload) => {
                if (err) {
                    res.json({
                        errorCode: ErrorCode.TokenError.CODE,
                        message: 'token error',
                    });
                    return;
                }
                const userID = (payload as any).id;
                let userToken: string;
                let user: User;
                [userToken, user] = await Promise.all([
                    this.redisService.getUserToken(userID),
                    this.redisService.getUser(userID),
                ]);
                const isLogin = userToken && token === userToken;
                if (isLogin && !user) {
                    user = await this.userService.getUser(userID);
                }
                if (isLogin) {
                    req.user = user;
                    res.locals.user = user;
                }
                next();
            });
        };
    }
}
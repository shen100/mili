import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { User, UserStatus } from '../../entity/user.entity';
import { ConfigService } from '../../config/config.service';
import { ErrorCode } from '../../constants/error';
import { MyHttpException } from '../exception/my-http.exception';

@Injectable()
export class ActiveGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        console.log(JSON.stringify({
            codeline: 'active.guard canActivate',
            ip: request.clientIp,
            timeLabel: new Date().toLocaleDateString(),
        }));
        const user = request.user as User;
        if (!user) {
            throw new MyHttpException({
                errorCode: ErrorCode.LoginTimeout.CODE,
            });
        }
        if (user.status === UserStatus.Actived) {
            return true;
        }
        throw new MyHttpException({
            errorCode: ErrorCode.Frozen.CODE,
        });
    }
}

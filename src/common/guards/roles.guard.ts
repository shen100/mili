import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../entity/user.entity';
import { ConfigService } from '../../config/config.service';
import { ErrorCode } from '../../config/constants';
import { MyHttpException } from '../../common/exception/my-http.exception';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly configService: ConfigService,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<number[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user as User;

        const hasRole = (role) => !!roles.find((item) => item === role);
        if (user && hasRole(user.role)) {
            return true;
        }
        throw new MyHttpException({
            errorCode: ErrorCode.Forbidden.CODE,
        });
    }
}

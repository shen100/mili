import { HttpException, HttpStatus } from '@nestjs/common';
import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ConfigService } from '../../config/config.service';
import { ErrorCode } from '../../constants/error';
import { MyHttpException } from '../exception/my-http.exception';

@Injectable()
export class ValidateDtoPipe implements PipeTransform<any> {
    constructor(
        private readonly configService: ConfigService,
    ) {}

    async transform(value, metadata: ArgumentMetadata) {
        if (metadata.type !== 'body') {
            return value;
        }
        const { metatype } = metadata;
        // 如果参数不是 类 而是普通的 JavaScript 对象则不进行验证
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object, { whitelist: true });
        if (!errors || errors.length <= 0) {
            return object;
        }

        let message;
        let errorCode;
        if (errors[0].constraints) {
            for (const key of Object.keys(errors[0].constraints)) {
                message = errors[0].constraints[key];
                const contexts = errors[0].contexts;
                if (contexts && typeof contexts[key] !== 'undefined' && contexts[key].errorCode !== 'undefined') {
                    errorCode = contexts[key].errorCode;
                }
                break;
            }
        } else {
            let children = errors[0].children;
            while (children && children[0]) {
                if (children[0].constraints) {
                    for (const key of Object.keys(children[0].constraints)) {
                        message = children[0].constraints[key];
                        const contexts = children[0].contexts;
                        if (contexts && typeof contexts[key] !== 'undefined' && contexts[key].errorCode !== 'undefined') {
                            errorCode = contexts[key].errorCode;
                        }
                        break;
                    }
                    break;
                }
                children = children[0].children;
            }
        }
        throw new MyHttpException({
            errorCode: errorCode || ErrorCode.ParamsError.CODE,
            message,
        });
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find(type => metatype === type);
    }
}

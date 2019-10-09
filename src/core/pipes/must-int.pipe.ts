import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    HttpException,
    HttpStatus,
    Paramtype,
} from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { ErrorCode } from '../../constants/error';
import { MyHttpException } from '../exception/my-http.exception';

@Injectable()
export class MustIntPipe implements PipeTransform<string, number> {
    constructor(
        private readonly configService: ConfigService,
    ) {}

    transform(value: string, metadata: ArgumentMetadata): any {
        if (metadata.type !== 'param' && metadata.type !== 'query') {
            return value;
        }
        const val = parseInt(value, 10);
        if (isNaN(val)) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        // value 为 12.html 时，转成整数val为12，这时也应该返回404
        if (val + '' !== value) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        return val;
    }
}
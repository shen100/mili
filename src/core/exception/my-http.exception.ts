import { HttpStatus, HttpException } from '@nestjs/common';
import { ErrorCode } from '../../constants/error';

class MyHttpExceptionData {
    errorCode?: number;
    message?: string;
}

export class MyHttpException extends HttpException {
    constructor(expData: MyHttpExceptionData) {
        if (typeof expData.errorCode === 'undefined') {
            expData.errorCode = ErrorCode.ParamsError.CODE;
        }
        super(expData, HttpStatus.OK);
    }
}
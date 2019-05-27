import { HttpStatus, HttpException } from '@nestjs/common';

class MyHttpExceptionData {
    errorCode?: number;
    message?: string;
}

export class MyHttpException extends HttpException {
    constructor(expData: MyHttpExceptionData) {
        super(expData, HttpStatus.OK);
    }
}
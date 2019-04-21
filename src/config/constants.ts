export const APIPrefix: string = '/api/v1';

export const NO_PARENT = 0;

export class UserConstants {
    static readonly USERNAME_MIN_LENGTH: number = 4;
    static readonly USERNAME_MAX_LENGTH: number = 16;
    static readonly PASSWORD_MIN_LENGTH: number = 6;
    static readonly PASSWORD_MAX_LENGTH: number = 20;
    static readonly CAPTCHA_LENGTH: number = 6;
}

export class ArticleConstants {
    static readonly SUMMARY_LENGTH: number = 100;
    static readonly MAX_CATEGORY_COUNT: number = 3;
    static readonly MAX_TITLE_LENGTH: number = 100;
}

export class CategoryConstants {
    static readonly CATEGORY_MIN_LENGTH: number = 1;
    static readonly CATEGORY_MAX_LENGTH: number = 20;
}

export class CollectionConstants {
    static readonly NAME_MIN_LENGTH: number = 1; // 专题名称最小长度
    static readonly NAME_MAX_LENGTH: number = 50; // 专题名称最大长度
    static readonly URL_MAX_LENGTH: number = 500;
    static readonly ANNOUNCEMENT_MIN_LENGTH: number = 0; // 专题公告最小长度
    static readonly ANNOUNCEMENT_MAX_LENGTH: number = 200; // 专题公告最大长度
    static readonly ADMIN_MAX_COUNT: number = 10; // 专题最多有多少个管理员
}

class CodeAndMsg {
    CODE: number;
    MESSAGE: string;
}

export class ErrorCode {
    static readonly SUCCESS: CodeAndMsg = { CODE: 0, MESSAGE: 'success' };
    static readonly ERROR: CodeAndMsg = { CODE: 1, MESSAGE: 'fail' };
    static readonly ParamsError: CodeAndMsg = { CODE: 2, MESSAGE: '参数错误' };

    static readonly Forbidden: CodeAndMsg = { CODE: 403, MESSAGE: '没有权限执行此操作' };
    static readonly NotFound: CodeAndMsg = { CODE: 404, MESSAGE: '找不到请求的资源' };

    static readonly LoginError: CodeAndMsg = { CODE: 1000, MESSAGE: '用户名或密码错误' };
    static readonly LoginTimeout: CodeAndMsg = { CODE: 1001, MESSAGE: '登录超时' };
    static readonly InActive: CodeAndMsg = { CODE: 1002, MESSAGE: '账号未激活' };

    static readonly TokenError: CodeAndMsg = { CODE: 1003, MESSAGE: 'token错误' };
    static readonly Frozen: CodeAndMsg = { CODE: 1004, MESSAGE: '账号已冻结' };

    static readonly InvalidUserName: CodeAndMsg = {
        CODE: 1005,
        MESSAGE: `昵称 格式不正确，需要是${UserConstants.USERNAME_MIN_LENGTH}到${UserConstants.USERNAME_MAX_LENGTH}个字符，只能包含英文、中文、下划线，不能包含空格。`,
    };

    static readonly InvalidPhone: CodeAndMsg = { CODE: 1006, MESSAGE: '无效的手机号' };
    static readonly InvalidCaptcha: CodeAndMsg = { CODE: 1007, MESSAGE: '验证码无效或已过期，请重新发送验证码' };

    static readonly InvalidPassword: CodeAndMsg = {
        CODE: 1008,
        MESSAGE: `密码需要是${UserConstants.PASSWORD_MIN_LENGTH}到${UserConstants.PASSWORD_MAX_LENGTH}个字符之间`,
    };

    static readonly UserNameExists: CodeAndMsg = { CODE: 1009, MESSAGE: '用户名已存在' };
    static readonly PhoneExists: CodeAndMsg = { CODE: 1010, MESSAGE: '手机号已存在' };

    static CodeToMessage(code: number): string {
        for (const key of Object.keys(this)) {
            if (this[key].CODE === code) {
                return this[key].MESSAGE;
            }
        }
        return '';
    }

    static HasCode(code: number): boolean {
        for (const key of Object.keys(this)) {
            if (this[key].CODE === code) {
                return true;
            }
        }
        return false;
    }
}
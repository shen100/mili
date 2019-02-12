export const ErrorCode = {
    SUCCESS: { CODE: 0, MESSAGE: 'success' },
    ERROR: { CODE: 1, MESSAGE: 'fail' },
    ParamsError: { CODE: 2, MESSAGE: '参数错误' },

    Forbidden: { CODE: 403, MESSAGE: '没有权限执行此操作' },
    NotFound: { CODE: 404, MESSAGE: '找不到请求的资源' },

    LoginError: { CODE: 1000, MESSAGE: '用户名或密码错误' },
    LoginTimeout: { CODE: 1001, MESSAGE: '登录超时' },
    InActive: { CODE: 1002, MESSAGE: '账号未激活' },

    TokenError: { CODE: 1003, MESSAGE: 'token错误' },
    Frozen: { CODE: 1004, MESSAGE: '账号已冻结' },

    InvalidUserName: { CODE: 1005, MESSAGE: '无效的用户名' },
    InvalidPhone: { CODE: 1006, MESSAGE: '无效的手机号' },
    InvalidCaptcha: { CODE: 1007, MESSAGE: '无效的验证码' },
    InvalidPassword: { CODE: 1008, MESSAGE: '无效的密码' },
    UserNameExists: { CODE: 1009, MESSAGE: '用户名已存在' },
    PhoneExists: { CODE: 1010, MESSAGE: '手机号已存在' },
};
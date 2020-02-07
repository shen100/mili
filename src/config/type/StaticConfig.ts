import BaseConfig from './BaseConfig';

export default class StaticConfig extends BaseConfig {
    readonly staticURL: string; // 前端静态资源
    readonly cssPath: string; // css路径
    readonly jsPath: string; // js路径
    readonly imgPath: string; // 图片路径
    readonly fontPath: string; // 字体路径
    readonly uploadImgURL: string; // 用户上传的图片
    readonly imgFormat: string;
    readonly imgMaxSize: number; // 设置上传图片的大小限制, 单位M
    readonly imgMaxSizeError: number; // 图片大小超过限制时的提示
    readonly userLevelChapterURL: string; // 用户等级在《如何使用米粒社区》中的章节url

    constructor(cfg) {
        super(cfg);
    }
}
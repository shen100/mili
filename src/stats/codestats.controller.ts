import {
    Controller, Get, Res,
} from '@nestjs/common';
import * as util from 'util';
import * as fs from 'fs';
import * as walk from 'walkdir';
import * as bluebird from 'bluebird';
import { APIPrefix } from '../constants/constants';
import { ConfigService } from '../config/config.service';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';

const ignores = [
    '.DS_Store',
    '.git',
    '.vscode',
    'node_modules',
    'fonts',
    'images',
    'package-lock.json',
    'LICENSE',
    'README',
    'geetest.js',
    'highlight.min.js',
    'jqueryx-1.11.3.min.js',
    'qrcode.min.js',
    'simplemde.min.js',
];

const ignoreMap = {};
for (const value of ignores) {
    ignoreMap[value] = true;
}

@Controller()
export class CodeStatsController {
    constructor(
        private readonly configService: ConfigService,
    ) {}

    @Get('/codestats')
    async code(@Res() res) {
        if (this.configService.env !== this.configService.DEVELOPMENT) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        res.render('pages/codeStats', {});
    }

    @Get(`${APIPrefix}/codetree`)
    async codeTree() {
        if (this.configService.env !== this.configService.DEVELOPMENT) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        const rootPath = process.cwd();
        let allFiles = [];
        let fileCount = 0;
        await (async function run() {
            return new Promise((resolve, reject) => {
                const emitter = walk(rootPath, {
                    return_object: false,
                    filter: (directory: string, files: string[]) => {
                        return files.filter(file => !ignoreMap[file]);
                    },
                });
                emitter.on('directory', async (filename, stat) => {
                    allFiles.push({ filename, isDirectory: true });
                });
                emitter.on('file', async (filename, stat) => {
                    fileCount++;
                    allFiles.push({ filename, isDirectory: false });
                });
                emitter.on('end', async () => {
                    resolve();
                });
            });
        }());

        allFiles = allFiles.map(file => {
            file.filename = file.filename.replace(rootPath, '');
            if (file.filename.charAt(0) === '/') {
                file.filename = file.filename.substr(1);
            }
            return file;
        });
        return { files: allFiles, fileCount };
    }

    @Get(`${APIPrefix}/codelinecount`)
    async codeLineCount() {
        if (this.configService.env !== this.configService.DEVELOPMENT) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        const readFileAsync = util.promisify(fs.readFile);
        const rootPath = process.cwd();
        let count = 0;
        const codeLineMap = {};
        const filenames = [];
        await (async function run() {
            return new Promise((resolve, reject) => {
                const emitter = walk(rootPath, {
                    return_object: false,
                    filter: (directory: string, files: string[]) => {
                        return files.filter(file => !ignoreMap[file]);
                    },
                });
                emitter.on('file', async (filename, stat) => {
                    filenames.push(filename);
                });
                emitter.on('end', async () => {
                    await bluebird.map(filenames, async (curFile) => {
                        const code = await readFileAsync(curFile, 'utf8');
                        const arr = code.split('\n');
                        count += arr.length;
                        let fileInProject = curFile.replace(rootPath, '');
                        if (fileInProject.charAt(0) === '/') {
                            fileInProject = fileInProject.substr(1);
                        }
                        codeLineMap[fileInProject] = arr.length;
                    }, {concurrency: 20});
                    resolve(count);
                });
            });
        }());
        return { count, codeLineMap };
    }
}
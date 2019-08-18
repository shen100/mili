import {
    Controller, Get, Res, Query, UseGuards,
} from '@nestjs/common';
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as walk from 'walkdir';
import * as sloc from 'sloc';
import * as bluebird from 'bluebird';
import { RolesGuard } from '../core/guards/roles.guard';
import { Roles } from '../core/decorators/roles.decorator';

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
];

const ignoreMap = {};
for (const value of ignores) {
    ignoreMap[value] = true;
}

@Controller()
export class CodeReviewController {
    constructor(
    ) {}

    @Get('/codereview')
    // @Roles('admin')
    // @UseGuards(RolesGuard)
    async code(@Res() res) {
        res.render('pages/codeReview', {});
    }

    @Get('/api/v1/codetree')
    // @Roles('admin')
    // @UseGuards(RolesGuard)
    async tree() {
        const rootPath = process.cwd();
        let allFiles = await walk.async(rootPath, {
            return_object: false,
            filter: (directory: string, files: string[]) => {
                files = files.filter(file => !ignoreMap[file]);
                return files;
            },
        });
        allFiles = allFiles.map(file => {
            file = file.replace(rootPath, '');
            if (file.charAt(0) === '/') {
                file = file.substr(1);
            }
            return file;
        });
        return { files: allFiles };
    }

    @Get('/api/v1/codelinecount')
    // @Roles('admin')
    // @UseGuards(RolesGuard)
    async codelinecount() {
        const readFileAsync = util.promisify(fs.readFile);
        const rootPath = process.cwd();
        let count = 0;
        const codelineMap = {};
        const filenames = [];
        await (async function run() {
            return new Promise((resolve, reject) => {
                const emitter = walk(rootPath, {
                    return_object: false,
                    filter: (directory: string, files: string[]) => {
                        files = files.filter(file => !ignoreMap[file]);
                        return files;
                    },
                });
                emitter.on('file', async (filename, stat) => {
                    filenames.push(filename);
                });
                emitter.on('end', async (filename, stat) => {
                    await bluebird.map(filenames, async (curFile) => {
                        const code = await readFileAsync(curFile, 'utf8');
                        const arr = code.split('\n');
                        count += arr.length;
                        let fileInProject = curFile.replace(rootPath, '');
                        if (fileInProject.charAt(0) === '/') {
                            fileInProject = fileInProject.substr(1);
                        }
                        codelineMap[fileInProject] = arr.length;
                    }, {concurrency: 20});
                    resolve(count);
                });
            });
        }());
        return { count, codelineMap };
    }
}
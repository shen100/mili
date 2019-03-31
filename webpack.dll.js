const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    // 当要打包成dll的js升级版本时，要修改 src/config/json.default.ts中的
    // dllJSTimestamp, 改成当前时间戳就行，主要是为了防止浏览器缓存旧js
    entry: {
        iview: [
            'iview',
        ],
        'tiptap': [
            'tiptap',
        ],
    },
    output: {
        path: path.join(__dirname, 'public', 'js', 'dll'),
        filename: '[name].dll.js',
        library: '[name]_dll_library',
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'public', 'js', 'dll', '[name]-manifest.json'),
            name: '[name]_dll_library',
        }),
    ],
};

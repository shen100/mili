const path = require('path');
const fs = require('fs');

/*
 * options:
 * viewDir
 * viewName
 * jsDirName
 * cssDirName
 * layoutDirname
 */
function MyInjectPlugin(options) {
    this.options = options || {};
}

MyInjectPlugin.prototype.apply = function(compiler) {
    const self = this;
    compiler.plugin('emit', function(compilation, callback) {
        function getAssetName(filename, type) {
            for (var assetName in compilation.assets) {
                console.log('assetName', assetName);
                let assetNameArr = assetName.split('.');
                if (assetNameArr[assetNameArr.length - 1] !== type) {
                    continue;
                }
                assetNameArr.splice(assetNameArr.length - 2, 1);
                let originalName = assetNameArr.join('.');
                if (originalName === filename) {
                    return assetName;
                }
            }
        }

        const htmlPath = path.join(self.options.viewDir, self.options.viewName);

        fs.readFile(htmlPath, function(err, data) {
            if (err) {
                throw err;
            }
            let html = data.toString();
            const multiReg = /{{\s*\`\${jsPath}\/([^'"`]+)\`\s*\|\s*injectJS\s*}}/gm;

            let match;
            const jsArr = [];
            const cssArr = [];
            while (match = multiReg.exec(html)) {
                console.log(match[1]);
                const jsName = match[1];
                const cssNameArr = jsName.split('.');
                cssNameArr.splice(cssNameArr.length - 1, 1);
                const cssName = cssNameArr.join('.') + '.css'

                let jsAssetName = getAssetName(self.options.jsDirName + path.sep + jsName, 'js');
                console.log('', );
                if (!jsAssetName) {
                    throw new Error(htmlPath + ` 找不到${jsName}对应的打包文件`);
                }
                jsArr.push({
                    name: jsName,
                    jsAssetName: jsAssetName
                });

                let cssAssetName = getAssetName(self.options.cssDirName + path.sep + cssName, 'css');
                if (cssAssetName) {
                    cssArr.push(cssAssetName);
                }
            }
            let publicPath = compiler.options.output.publicPath;
            if (publicPath.charAt(publicPath.length - 1) !== '/') {
                publicPath += '/';
            }
            if (jsArr.length) {
                jsArr.forEach((jsData) => {
                    const reg = new RegExp('{{\\s*\\`\\${jsPath}\\/' + jsData.name + '\\`\\s*\\|\\s*injectJS\\s*}}');
                    html = html.replace(reg, `{{ '${publicPath}${jsData.jsAssetName}' | injectJS }}`);
                });
            }
            if (cssArr.length) {
                const cssLinks = [];
                cssArr.forEach((cssAssetName) => {
                    cssLinks.push(`<link charset="utf-8" href="${publicPath}${cssAssetName}" rel="stylesheet">`);
                });
                console.log('self.options.viewName', self.options.viewName);
                if (self.options.viewName.indexOf(self.options.layoutDirname) === 0) {
                    html = html.replace(/{% block commoncss %}\s*{% endblock %}/, [
                        '{% block commoncss %}',
                        ...cssLinks,
                        '{% endblock %}'
                    ].join(''));
                } else {
                    html += [
                        '\n\n{% block css %}\n',
                        ...cssLinks,
                        '\n{% endblock %}'
                    ].join('')
                }
            }
            // 将这个列表作为一个新的文件资源，插入到 webpack 构建中
            compilation.assets['../views/' + self.options.viewName] = {
                source: function() {
                    return html;
                },
                size: function() {
                    return html.length;
                }
            };
            callback();
        });
    });
};

module.exports = MyInjectPlugin;
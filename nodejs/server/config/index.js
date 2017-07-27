var fs   = require('fs');
var path = require('path');

var configData;

//只在程序启动时，读一次配置文件，此时可以使用同步的io操作
try {
	var configStr = fs.readFileSync(path.join(__dirname, '../../../configuration.json'), 'utf8');
	configStr     = configStr.replace(/\/\*.*\*\//g, '');
	configData    = JSON.parse(configStr);
} catch (err) {
	console.log(err);
	process.exit(0);
}

/*
 * nodejs和go都用同一个配置文件(即configuration.json)进行配置
 */
var config = {
	webPoweredBy    : configData.nodejs.webPoweredBy,/*前端node.js加的X-Powered-By*/
	staticPoweredBy : configData.nodejs.staticPoweredBy,/*前端静态文件服务器加的X-Powered-By*/
	env          : configData.nodejs.env,/*模式(开发，测试，产品)*/
	useProxy     : configData.nodejs.useProxy, /*node.js发请求是否使用代理*/
	proxyUri     : configData.nodejs.proxyUri, /*代理地址及端口*/
	port         : configData.nodejs.port,  /*前端node.js监听的端口*/
	staticPort   : configData.nodejs.staticPort,  /*前端静态文件服务器监听的端口（本地开发时使用）*/
	uploadImgDir : configData.go.UploadImgDir, /*图片上传的目录*/
	page: {
		title      : configData.nodejs.page.title,
		jsPath     : configData.nodejs.page.jsPath,
		imagePath  : configData.nodejs.page.imagePath,
		cssPath    : configData.nodejs.page.cssPath,
		host       : configData.go.Host,
		imgPath    : configData.go.ImgPath, /*上传后的图片请求地址前缀*/
		apiPath    : configData.api.Prefix
	},
	api: {
		//todayOrderCount : "/admin/order/todaycount",
	}
};

(function() {
	var url = configData.api.URL;
	for (var key in config.api) {
		if (config.api.hasOwnProperty(key)) {
			config.api[key] = url + config.api[key];
		}
	}
}())

module.exports = config;

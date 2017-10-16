const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


var portDefault = 8084;
var options = {
	publicPath: 'http://10.10.10.5:' + portDefault + '/'
}

module.exports = {
	entry: {
		entry: './src/js/entry.js'
	},
	output: {
		//通用路径可让打包后的  css 引用img url 通过通用路径访问到，解决路径异常问题
		publicPath: options.publicPath,
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
                	use: "css-loader"
				})
//				include,
//				exinclude
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					/*
					 * loader(e.g 'style-loader') that should be used when the CSS is not extracted (i.e. in an additional chunk when allChunks: false)
					 */
					//当样式文件不需要被提取的时候，需要用fallback: 'style-loader'
					//fallback: 'style-loader',
					use: [{
						loader: 'css-loader'
					},{
						loader: 'sass-loader'
					}]
				})
			},
			{
				test: /\.(png|jpg|gif)/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 5000,
						//图片如果过大，图片输出路径，
						outputPath: 'images/'
					}
				}]
			}
		]
	},
	plugins: [
//		new uglify(),
		new htmlPlugin({
			//minify：是对html文件进行压缩
			minify: {
				//removeAttrubuteQuotes是却掉属性的双引号
				removeAttributeQuotes: true
			},
			//hash：为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS
			hash: true,
			//template：是要打包的html模版路径和文件名称
			template: './src/index.html'
		}),
		//此处路径为生成的CSS路径而不是css原路径
		new ExtractTextPlugin("./src/css/index.css")
	],
	devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		host: '10.10.10.5',
		compress: true,
		port: portDefault
	}
}

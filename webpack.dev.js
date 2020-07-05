// webpack.common.js
const path = require('path')
const webpack = require('webpack')
const common = require('./webpack.common')
const merge = require('webpack-merge')
const { HotModuleReplacementPlugin } = webpack;

module.exports = merge(common, {
	mode: 'development',
	devServer: {
		// 打包生成的静态文件所在的位置
		// （若是devServer里面的publicPath没有设置，
		// 则会认为是output里面设置的publicPath的值）
		// publicPath: '/',
		// 静态资源
		contentBase: [
				path.join(__dirname, './public')
		],
		compress: true,
		hot: true,
		open: true,
		port: 9000,
	},
	devtool: 'cheap-modules-eval-source-map',
	plugins: [
		new HotModuleReplacementPlugin()
	]
})
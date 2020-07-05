// webpack.common.js
const common = require('./webpack.common')
const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = merge(common, {
	mode: 'production', // 生产模式自动开启minimize
	devtool: 'none',
	output: {
		filename: '[name]-[contenthash:8].bundle.js',
		// 默认输出到dist
		// path: path.join(__dirname, 'dist'),
		// 打包生成的index.html文件里面引用资源的前缀
		// publicPath: '/'
	},
	optimization: {
		// 多入口提取公共部分
		// solitChunks: {
		// 	chunks: 'all'
		// }
		// 开启minimize属性时生效
		// minimizer: [
		// 	new OptimizeCssAssetsWebpackPlugin(),
		// 	// 开启后需手动压缩js
		// 	new TerserWebpackPlugin()
		// ]
	},
	module: {
		rules: [
			// {
			// 	test: /\.css$/,
			// 	use: [
			// 		// 超过150kb 单独提取
			// 		MiniCssExtractPlugin.loader,
			// 		'css-loader',
			// 	]
			// },
			// {
			// 	test: /\.less$/,
			// 	use: [
			// 		MiniCssExtractPlugin.loader,
			// 		'css-loader',
			// 		'less-loader'
			// 	]
			// },
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'public', to: '.' },
			],
		}),
		// new MiniCssExtractPlugin({
    //   // Options similar to the same options in webpackOptions.output
    //   // both options are optional
    //   filename: '[name]-[contenthash:8].bundle.css',
    //   chunkFilename: '[id]-[contenthash.chunk.css',
		// })
	]
})
// webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
	mode: 'none',
	entry: './src/main.js',
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, 'dist'),
		// 打包生成的index.html文件里面引用资源的前缀
		// publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			// 它会应用到普通的 `.js` 文件
			// 以及 `.vue` 文件中的 `<script>` 块
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
			// 它会应用到普通的 `.css` 文件
			// 以及 `.vue` 文件中的 `<style>` 块
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader',
				]
			},
			{
				test: /\.less$/,
				use: [
					'vue-style-loader',
					'css-loader',
					'less-loader'
				]
			},
			{
				test: /\.png$/,
				use: [
          {
            loader: 'url-loader',
            options: {
							// It's because in @vue/component-compiler-utils
							// we transformed the asset urls to require statements, 
							// which expect CommonJS modules, while the recent major
							// release of url-loader emits ES modules by default.
							esModule: false, // 
              limit: 10 * 1024 // 10kb
            }
          }
        ]
			},
			// 不启用，与HtmlWebpackPlugin功能重复并且有冲突
			// {
			// 	test: /\.html$/,
			// 	use: [
      //     {
      //       loader: 'html-loader',
      //       options: {
      //         attrs: ['img:src', 'a:href']
      //       }
      //     }
      //   ]
			// },
		]
	},
	plugins: [
		// 这个插件是必须的！
		// 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。
		// 例如，如果你有一条匹配 /\.js$/ 的规则，
		// 那么它会应用到 .vue 文件里的 <script> 块
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			title: 'Awesome Vue!',
			template: 'public/index.html',
			templateParameters: {
				BASE_URL: '/'
			}
		}),
	]
}
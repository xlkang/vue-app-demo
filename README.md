# vue-app-demo

1. 这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构
2. 原本移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）
3. 现在使用 webpack 以及一些周边工具、Loader、Plugin 还原这个项目的打包任务

## 所有开发依赖

### 工具库

- @babel/core
- @babel/preset-env
- babel-eslint
- eslint
- eslint-plugin-vue
- husky
- lint-staged
- vue-template-compiler
- webpack
- webpack-cli
- webpack-dev-server
- webpack-merge

### Webpack Loaders

- babel-loader
- @vue/cli-plugin-babel
- css-loader
- eslint-loader
- file-loader
- less-loader
- style-loader
- url-loader
- vue-loader

### Webpack Plugins

- clean-webpack-plugin
- copy-webpack-plugin
- html-webpack-plugin
- mini-css-extract-plugin
- optimize-css-assets-webpack-plugin
- terser-webpack-plugin

## Webpack配置说明

### webpack配置文件拆分

将webpack配置文件拆分为```webpack.common.js```,```webpack.dev.js```,```webpack.prod.js```, ```webpack.common.js```为公共配置,```webpack.dev.js```为开发环境独有配置,```webpack.prod.js```为生产环境独有配置，通过```webpack-merge```模块提供的```merge```方法进行合并和去重

### webpack.common.js

- 配置打包模式

```js
module.exports = {
	mode: 'none',
	...
}
```
- 配置打包入口

```js
module.exports = {
	entry: './src/main.js',
	...
}
```
- 配置输出文件路径

```js
module.exports = {
	output: {
		// 输出文件名
		filename: 'bundle.js',
		// 输出目录
		path: path.join(__dirname, 'dist'),
		// 打包生成的index.html文件里面引用资源的前缀
		// publicPath: '/'
	},
	...
}
```

- 配置loader

```js
module.exports = {
	module: {
	rules: [
		// .vue文件通过vue-loader加载
		{
			test: /\.vue$/,
			loader: 'vue-loader'
		},
		// 依赖vue-loader/lib/plugin应用到普通的 `.js` 文件
		// 以及 `.vue` 文件中的 `<script>` 块
		{
			test: /\.js$/,
			loader: 'babel-loader',
			// 排除 node_modules
			exclude: /node_modules/,
		},
		// 配置eslint-loader
		{
			// 该配置项强制将eslint-loader优先处理
			enforce: 'pre',
			test: /\.(js|vue)$/,
			loader: 'eslint-loader',
			// 排除 node_modules
			exclude: /node_modules/
		},
		// 它会应用到普通的 `.css` 文件
		// 以及 `.vue` 文件中的 `<style>` 块
		{
			test: /\.css$/,
			use: [
				// 将转换后的模块插入到对应js文件中
				'vue-style-loader',
				// 先将css文件转换为js模块
				'css-loader',
			]
		},
		{
			test: /\.less$/,
			use: [
				// 将转换后的模块插入到对应js文件中
				'vue-style-loader',
				// 先将css文件转换为js模块
				'css-loader',
				// 先将less文件转换为css
				'less-loader'
			]
		},
		// 配置url-loader处理图片资源
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
						// 大小小于limit的图片，转换为data url编码直接注入html
						// 否则使用默认的file-loader将图片转换为js模块导入
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
	...
}
```

- 配置plugin
```js
module.exports = {
	...,
	plugins: [
		// 这个插件是必须的！
		// 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。
		// 例如，如果你有一条匹配 /\.js$/ 的规则，
		// 那么它会应用到 .vue 文件里的 <script> 块
		new VueLoaderPlugin(),
		// HtmlWebpackPlugin自动生成html并且注入其他打包资源的引用
		new HtmlWebpackPlugin({
			// 以htmlWebpackPlugin.options访问的变量
			title: 'Awesome Vue!',
			// 模版文件
			template: 'public/index.html',
			// 传入一些ejs模版可以读取的参数
			templateParameters: {
				BASE_URL: '/'
			}
		}),
	]
}
```

### webpack.dev.js

- 通过```webpack-merge```模块提供的merge方法合并common配置和去重

```js
const common = require('./webpack.common')

module.exports = merge(common, {
	...
})
```

- 配置开发工作模式

```js
module.exports = merge(common, {
	mode: 'development',
	...
})
```

- 配置开发服务器，可利用webpack-dev-server启动开发服务器

```js
const path = require('path')

module.exports = merge(common, {
	devServer: {
		// 打包生成的静态文件所在的位置
		// （若是devServer里面的publicPath没有设置，
		// 则会认为是output里面设置的publicPath的值）
		// publicPath: '/',
		// 打包之外的静态资源的路径
		contentBase: [
				path.join(__dirname, './public')
		],
		// 是否压缩
		compress: true,
		// 开启热更新
		hot: true,
		// 自动打开浏览器
		open: true,
		// 监听的端口
		port: 9000,
	},
	...
})
```

- 配置开发环境的source map工作模式

```js
module.exports = merge(common, {
	// 阉割的按具体模块通过eval函数生成的source-map，
	// 包含了具体的行列信息
	devtool: 'cheap-modules-eval-source-map',
	...
})
```

- 配置HMR插件

```js
const webpack = require('webpack')
const { HotModuleReplacementPlugin } = webpack;

module.exports = merge(common, {
	plugins: [
		// 热更新需要使用的插件
		new HotModuleReplacementPlugin()
	]
	...
})
```

### webpack.prod.js

- 同样通过```webpack-merge```模块提供的merge方法合并common配置和去重

```js
module.exports = merge(common, {
	...
})
```

- 配置生产工作模式

```js
const common = require('./webpack.common')

module.exports = merge(common, {
	mode: 'production',
	...
})
```

- 配置生产环境的source map工作模式

```js
module.exports = merge(common, {
	// 不生成source map，保护源代码
	devtool: 'none',
	...
})
```

- 配置生产环境的输出路径

```js
module.exports = merge(common, {
	output: {
		// 添加contenthash值，在文件内容变化时，自动打包生成新的文件名，防止缓存
		// 多入口打包时，自动生成的文件名将以入口名[name]作为前缀
		filename: '[name]-[contenthash:8].bundle.js',
		// 默认输出到dist
		// path: path.join(__dirname, 'dist'),
		// 打包生成的index.html文件里面引用资源的前缀
		// publicPath: '/'
	},
	...
})
```

- 配置生产环境的优化插件

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
	plugins: [
		// 每次打包时自动清除dist目录
		new CleanWebpackPlugin(),
		// 复制public文件夹的所有静态资源文件到打包输出目录下
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
	...
})
```

## package.json主要配置说明

- 开发打包及开发服务器启动任务

```shell
"scripts": {
	"serve": "webpack-dev-server --config webpack.dev.js",
},
```

通过```webpack-dev-server```命令自动进行webpack打包，并且启动开发服务器，```--config```参数指定配置文件为```webpack.dev.js```, 具体工作参考配置文件说明

- 生产构建任务

```shell
"scripts": {
	"build": "webpack --config webpack.prod.js",
},
```

通过```webpack```命令进行webpack打包，```--config```参数指定配置文件为```webpack.prod.js```, 具体工作配置参考配置文件说明

- 代码校验任务

```shell
"scripts": {
	"lint": "eslint",
},
```

通过```eslint```命令进行代码检查，```eslint```会自动读取```package.json```中的```eslintConfig```中配置的配置项，注意其中使用了专门用于检查.vue文件语法规则的```plugin:vue/essential```，需要安装```eslint-plugin-vue```依赖，以及解析器```babel-eslint```

```shell
"eslintConfig": {
	"root": true,
	"env": {
		"node": true
	},
	"extends": [
		"plugin:vue/essential",
		"eslint:recommended"
	],
	"parserOptions": {
		"parser": "babel-eslint"
	},
	"rules": {}
},
```

- git提交代码预检查任务

首先通过husky自动配置git hooks, 这里用husky重载了git hooks的pre-commit脚本，它将在使用git commit 命令的时候执行 ```yarn precommit```命令

```shell
"husky": {
	"hooks": {
		"pre-commit": "yarn precommit"
	}
}
```

在```npm scripts```中配置precommit命令，将它指向了```lint-staged```命令

```shell
"scripts": {
	"precommit": "lint-staged"
},
```

```lint-staged```将根据匹配规则匹配到的所有文件，应用```eslint```命令，在```eslint```任务检查通过后，自动```git add```并且完成提交，否则将会退出

```shell
"lint-staged": {
	"*.js": [
		"eslint"
	],
	"*.vue": [
		"eslint"
	]
}
```

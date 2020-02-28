const HTMLWebpackPlugin = require('html-webpack-plugin')
const { join } = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const { HotModuleReplacementPlugin } = require('webpack')

const config = {
	mode: 'development',
	entry: join(__dirname, 'src/app.js'),
	output:{
		path: join(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	devServer:{
		port: 8080,
		open: true,
		historyApiFallback: true
	},
	module:{
		rules:[
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader'
				]
			}
		]
	},
	plugins:[
		new HotModuleReplacementPlugin(),
		new VueLoaderPlugin(),
		new HTMLWebpackPlugin({
			showErrors: true,
			cache: true,
			title: 'Vue with Webpack Start Project',
			template: join(__dirname, 'src/index.html')
		})
	]
}

module.exports = config

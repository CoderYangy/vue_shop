module.exports = {
	configureWebpack: {
		resolve: {
			alias: {
				'assets': '@/assets',
				'common': '@/common',
				'components': '@/components',
				'network': '@/network',
				'views': '@/views',
			}
		}
	},
	chainWebpack: config => {
		// 发布模式
		config.when(process.env.NODE_ENV === 'production', config => {
			config.entry('app').clear().add('./src/main-prod.js')
			// CDN加载
		config.set('externals', {
			vue: 'Vue',
			// 'vue-router': 'VueRouter',
			axios: 'axios',
			lodash: '_',
			echarts: 'echarts',
			nprogress: 'NProgress',
			// 'vue-quill-editor': 'VueQuillEditor',
			moment: 'moment'
		})
		})
// 开发模式
		config.when(process.env.NODE_ENV === 'development', config => {
			config.entry('app').clear().add('./src/main-dev.js')
		})
	},

}
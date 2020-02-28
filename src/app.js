import Vue from 'vue'
import Main from './components/Main.vue'
import UxStatePlugin from './plugins/uxStatePlugin'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const uxState = require('./uxState/index')
Vue.config.devtools = true
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(UxStatePlugin, {
	state: uxState,
	componentName: 'ux-state',
	debug: true
})

new Vue({
	render: h => h(Main)
}).$mount('#app')

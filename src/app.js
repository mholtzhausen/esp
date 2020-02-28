import Vue from 'vue'
import Main from './components/Main.vue'
import UxStatePlugin from './plugins/uxStatePlugin'


const uxState = require('./uxState/index')

const config = {
	state: uxState,
	componentName: 'ux-state',
	debug: true
}

Vue.use(UxStatePlugin, config)
// Vue.use(UxStatePlugin, {
// 	authenticated: false
// })

new Vue({
	render: h => h(Main)
}).$mount('#app')


const uxStatePlugin = {
	install (Vue, options) {
		options = Object.assign({
			componentName: 'ux-state',
			debug: false,
			state: {
				example: {
					value: 'false',
					states: ['true', 'false'],
					validate: {
						'true > false': (context) => {
							console.log('loggedin > loggedout', context)
							return true
						}
					},
					beforeTransition: {
						'true > false': (context) => {
							return true
						}
					},
					afterTransition: {
						'true > false': (context) => {
							return true
						}
					},
				}

			}
		}, options || {})

		let state = options.state
		const debug = options.debug ? console.log.bind(console) : () => { }

		debug(`uxStatePlugin Debug -----`, options)
		Vue.prototype.uxSet = function(prop, newValue) {
			let target = state[prop]
			let oldValue = target.value
			let validate = target.validate || {}
			debug(`uxSet(${prop},${newValue})//oldValue=${oldValue}`)

			debug(` .. Starting transition validation`)

			const isValidState = target.states.indexOf(newValue) >= 0
			debug(` .. .. transioning to a valid state : ${isValidState ? "Yes" : "No"}`)

			const transitionName = `${oldValue} > ${newValue}`
			const context = { target, oldValue, validate, prop, newValue, transitionName }
			if (transitionName in validate) {
				let transitionValidation = validate[transitionName]
				if (typeof transitionValidation === 'function') {
					let transitionValid = transitionValidation(context)
					debug(` Transition${transitionValid ? '' : ' Not'} Valid`)
					if (!transitionValid) return [false, `${transitionName} transition not valid`]
				}
			}
			debug(` .. .. execute any validation functions registered for : ${oldValue} > ${newValue}`)

			if ('beforeTransition' in target) {
				let bt = target.beforeTransition
				debug(`.. found beforeTransition for ${transitionName}`, bt)
				if (
					typeof bt === 'object'
					&& transitionName in bt
					&& typeof bt[transitionName] === 'function'
				) {
					debug(`  .. ..   executing`)
					if(!bt[transitionName](context)){
						return [false, `${transitionName} beforeTransition cancelled`]
					}
				}
			}
		
			debug(`TRANSITION ${prop} : ${transitionName}`)
			Vue.set(target, 'value', newValue)
		
			if ('afterTransition' in target) {
				let bt = target.afterTransition
				debug(`.. found afterTransition for ${transitionName}`, bt)
				if (
					typeof bt === 'object'
					&& transitionName in bt
					&& typeof bt[transitionName] === 'function'
				) {
					debug(`  .. ..   executing`)
					bt[transitionName](context)
				}
			}
			return [true, { oldValue, newValue, isValidState, transitionName }]
		}

		Vue.prototype.$ux = new Proxy(Vue.observable(state), {
			set (target,p,value) {
				 return Vue.prototype.uxSet(p,value)
			},
			get (target, p) {
				return target[p].value
			}
		})

		Vue.component(options.componentName, {
			render (h) {
				return this.show && h('div', this.$slots.default)
			},
			computed: {
				show () {
					console.log(this.$props)
					if (!(this.$props.name in this.$ux)) return false
					return this.$ux[this.$props.name] === this.$props.value
				}
			},
			props: {
				name: {
					type: String,
					required: true
				},
				value: {
					type: [String, Number, Boolean, Array, Object, Function],
					required: true
				}
			}
		})


	}
}

module.exports = uxStatePlugin

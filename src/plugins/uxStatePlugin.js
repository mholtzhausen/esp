
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

		const $ux = new Proxy(Vue.observable(state), {
			set (target, p, value) {
				return Vue.prototype.uxSet(p, value)
			},
			get (target, p) {
				if (!(p in target)) return
				return target[p].value
			}
		})

		debug(`uxStatePlugin Debug -----`, options)
		Vue.prototype.uxSet = function(prop, newValue) {
			if (!(prop in state)) state[prop] = { value: '', validate: {}, beforeTransition: {}, afterTransition: {} }
			let target = state[prop]
			let oldValue = target.value
			let validate = target.validate || {}

			const ret = (success, value) => [success, value]

			debug(`uxSet(${prop},${newValue})//oldValue=${oldValue}`)

			debug(` .. Starting transition validation`)

			const isValidState = 'states' in target ? target.states.indexOf(newValue) >= 0 : true
			debug(` .. .. transioning to a valid state : ${isValidState ? "Yes" : "No"}`)

			const transitionName = `${oldValue} > ${newValue}`
			const context = { $ux, state, options, target, oldValue, validate, prop, newValue, transitionName }
			if (transitionName in validate) {
				let transitionValidation = validate[transitionName]
				if (typeof transitionValidation === 'function') {
					let transitionValid = transitionValidation(context)
					debug(` Transition${transitionValid ? '' : ' Not'} Valid`)
					if (!transitionValid) return ret(false, `${transitionName} transition failed validation`)
				}
			}
			debug(` .. .. execute any validation functions registered for : ${oldValue} > ${newValue}`)


			if ('constraints' in target) {
				const c = target.constraints
				if (oldValue in c) {
					if(c[oldValue].indexOf(newValue)<0) return ret(false,`${transitionName} transition failed with constraints`)
				}
				debug(` .. .. is this flow allowed`)
			}

			if ('beforeTransition' in target) {
				let bt = target.beforeTransition
				debug(`.. found beforeTransition for ${transitionName}`, bt)
				if (
					typeof bt === 'object'
					&& transitionName in bt
					&& typeof bt[transitionName] === 'function'
				) {
					debug(`  .. ..   executing`)
					if (!bt[transitionName](context)) {
						return ret(false, `${transitionName} beforeTransition cancelled`)
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
			return ret(true, { oldValue, newValue, isValidState, transitionName })
		}

		Vue.prototype.$ux = $ux

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

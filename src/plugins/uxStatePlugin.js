
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

		const $ = {}
		const $ux = new Proxy(Vue.observable(state), {
			set (target, p, value) {
				if (p === '$') return $
				return $.set(p, value)
			},
			get (target, p) {
				if (p === '$') return $
				if (!(p in target)) return
				return target[p].value
			}
		})

		$.set = function(prop, newValue) {
			let canSet = this.canSet(prop, newValue)
			if (!canSet.success) return false

			let target = state[prop]
			let oldValue = target.value
			let validate = target.validate || {}

			const transitionName = `${oldValue} > ${newValue}`
			const context = { $ux, state, options, target, oldValue, validate, prop, newValue, transitionName }

			if ('beforeTransition' in target) {
				if (
					typeof target.beforeTransition === 'object'
					&& transitionName in target.beforeTransition
					&& typeof target.beforeTransition[transitionName] === 'function'
				) {
					if (!target.beforeTransition[transitionName](context)) {
						return ret(false, `${transitionName} beforeTransition cancelled`)
					}
				}
			}

			Vue.set(target, 'value', newValue)

			if ('afterTransition' in target) {
				if (
					typeof target.afterTransition === 'object'
					&& transitionName in target.afterTransition
					&& typeof target.afterTransition[transitionName] === 'function'
				) {
					target.afterTransition[transitionName](context)
				}
			}

			return transitionName
		}

		$.canSet = function(prop, newValue) {
			if (!(prop in state)) state[prop] = { value: '', validate: {}, beforeTransition: {}, afterTransition: {} }

			let target = state[prop]
			let oldValue = target.value
			let validate = target.validate || {}

			const ret = (success, reason) => ({ success, reason })

			const isValidState = 'states' in target ? target.states.indexOf(newValue) >= 0 : true
			if (!isValidState) return ret(false, `${newValue} not defined in target.states `)

			const transitionName = `${oldValue} > ${newValue}`
			const context = { $ux, state, options, target, oldValue, validate, prop, newValue, transitionName }


			if (transitionName in validate) {
				let transitionValidation = validate[transitionName]
				if (typeof transitionValidation === 'function') {
					let transitionValid = transitionValidation(context)
					if (!transitionValid) return ret(false, `${transitionName} transition failed validation`)
				}
			}


			if ('constraints' in target) {
				const c = target.constraints
				if (oldValue in c) {
					if (c[oldValue].indexOf(newValue) < 0) return ret(false, `${transitionName} transition failed with constraints`)
				}
			}

			return ret(true, transitionName)
		}


		window.$ux = $ux

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

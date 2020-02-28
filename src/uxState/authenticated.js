const authenticated = {
	value: 'false',
	states: ['true', 'false'],
	validate: {
		'true > false': (context) => {
			console.log(`validate ${context.transitionName}`, context)
			return true
		}
	},
	beforeTransition: {
		'false > true': (context) => {
			console.log(`beforeTransition ${context.transitionName}`, context)
			return true							
		}
	},
	afterTransition: {
		'true > false': (context) => {
			console.log(`afterTransition ${context.transitionName}`, context)
			return true							
		}
	},

}

module.exports = authenticated


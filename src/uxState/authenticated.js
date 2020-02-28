const authenticated = {
	value: 'false',
	states: ['true', 'false'],
	constraints:{
		'true':['false'],
		'false':['true'],
	},
	validate: {
		'true > false': (context) => {
			console.log(`validate ${context.transitionName}`, context)
			return true
		}
	},
	afterTransition: {
		'true > false': ({$ux}) => {
			$ux.login='captureEmail'
			return true							
		}
	},

}

module.exports = authenticated


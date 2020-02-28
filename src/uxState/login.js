const login = {
	value: 'captureEmail',
	default: 'captureEmail',
	states: [
		'captureEmail',
		'capturePassword',
		'registerPassword',
		'authenticating',
		'authenticated'
	],

	constraints:{
		'captureEmail': ['capturePassword','registerPassword'],
		'capturePassword': ['authenticating'],
		'registerPassword': ['registering','captureEmail'],
		'authenticating': ['authenticated'],
		'authenticated':[]
	},

	afterTransition:{
		'authenticating > authenticated':({$ux})=>{
			$ux.authenticated = 'true'
		}
	}

}

module.exports = login


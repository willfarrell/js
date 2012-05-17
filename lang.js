
// key: value;
var lang = {};

var language = {
	
	default_lang: 'en',
	supported: ['en'], // EFIGs to be done
	
	// called from settings.init();
	init: function() {
		// load all key values from localization files
		if (this.supported.indexOf(settings.core.language) !== -1) {
			this.change(settings.core.language);
		} else {
			this.change(this.default_lang);
		}
	},
	
	change: function(language) {
		//log('./lang/'+language+'/app.json');
		var res = __io('./lang/'+language+'/app.json');
		log('lang res');
		if (res !== null) {
			lang = JSON.parse(res);
			//settings.core.language = language; // overwrite if different
		} else {
			var base_lang = language.substr(0,2);
			if (base_lang !== language) {	// try base language
				this.change(this.base_lang);
			} else {	// use default language
				this.change(this.default_lang);
			}
		}
	},
	
	
	
};
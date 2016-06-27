/*global javascripture*/
javascripture.modules.colors = {
	getStrongsColor: function ( strongsInt ) {
		if ( isNaN ( strongsInt ) ) {
			strongsInt = 0;
		}
		var theSizeOfAColorSegment = 360 / 8000,
			hue = strongsInt * theSizeOfAColorSegment,
			staturation = javascripture.state.settings.subdue * 100 + '%',
			lightness = javascripture.state.settings.subdue * 100 + '%';
		return 'hsl( ' + hue + ',' + staturation + ', ' + lightness + ' )';
	},

	getStrongsStyle: function ( strongsNumber ) {
		highlightWordsWith
		var hightlightFamilies = javascripture.state.settings.highlightWordsWith === 'family',
			className,
			classInt;
		if ( hightlightFamilies ) {
			className = javascripture.api.word.getFamily( strongsNumber ) + '-family';
			classInt = parseFloat( strongsNumber.substring( 1, strongsNumber.length ), 10 );
		} else {
			className = strongsNumber;
			classInt = parseInt( strongsNumber.substring( 1, strongsNumber.length ), 10 );
		}

		var newColor = javascripture.modules.colors.getStrongsColor( classInt );
		return '.' + className + ' {color:#fff !important;background:' + newColor + ' !important;}';
	}
};

const initialVersions = [
	[ 'original', 'Original' ],
	[ 'kjv', 'KJV' ],
	[ 'web', 'WEB' ],
	[ 'esv', 'ESV' ],
	[ 'lc', 'Literal' ],
	[ 'faropv', 'ترجمه-ی قدام' ],
	[ 'fartpv', 'مژده برای اسرع جدید' ],
];

const versions = ( state = initialVersions , action ) => {
	let returnState;
	switch ( action.type ) {
		default:
			return state;
	}
}

export default versions;
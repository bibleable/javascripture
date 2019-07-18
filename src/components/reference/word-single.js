// External
import React from 'react';
import classnames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// Internal
import { getFamily } from '../../lib/word';
import morphology from '../../lib/morphology';
import styles from './styles.scss';

const getByLemmaAndMorph = function( lemma, morph ) {
	if ( 'undefined' !== typeof lemma && 'undefined' !== typeof javascripture.data.literalConsistent[ lemma ] ) {
		if ( 'undefined' !== typeof morph && 'undefined' !== typeof javascripture.data.literalConsistent[ lemma ][ morph ] ) {
			return javascripture.data.literalConsistent[ lemma ][ morph ];
		}

		if( javascripture.data.literalConsistent[ lemma ]['no-morph'] ) {
			return javascripture.data.literalConsistent[ lemma ]['no-morph'];
		}

		var firstKey = Object.keys(javascripture.data.literalConsistent[ lemma ])[0];
		return javascripture.data.literalConsistent[ lemma ][ firstKey ];
	}
	if ( 'undefined' !== typeof morph && 'undefined' !== typeof javascripture.data.literalConsistent[ morph ] ) {
		return javascripture.data.literalConsistent[ morph ];
	}
	return 'todo';
};

class WordSingle extends React.Component {
	state = {
		style: {},
	}

	getLemma() {
		if ( this.props.lemma) {
			return this.props.lemma.split( ' ' ).split( '/' ).filter( function( lemma ) {
				return lemma != 'G3588';
			} );
		}

		return [];
	}

	wordStyle() {
		let wordStyle = {};
		if ( this.props.textTransform ) {
			wordStyle.textTransform = this.props.textTransform;
		}
		return wordStyle;
	}

	getWord() {
		const { lemma, morph, version, word } = this.props;
		if ( version === 'LC' ) {
			return getByLemmaAndMorph( lemma, morph ) + ' ';
		}

		return word;
	}

	clearHighlightWord = () => {
		window.updateAppComponent( 'highlightedWord', '' );
	};

	highlightWord = () => {
		let strongsNumber = this.props.lemma;
		if ( this.props.settings.highlightWordsWith === 'family' ) {
			strongsNumber = getFamily( this.props.lemma );
		}

		window.updateAppComponent( 'highlightedWord', strongsNumber );
	};

	selectWord = () => {
		if( this.props.searchSelect ) {
			this.props.selectSearchTerm( this.props.searchSelect, this.props[ this.props.searchSelect ] );
			return;
		}

		this.props.addWord( this.props.settings.subdue );
	};

	getTitle = () => {
		const { lemma, morph } = this.props;
		if ( ! lemma ) {
			return null;
		}
		return lemma;
		//return morph ? lemma + ' ' + morphology( morph, 'noLinks', lemma ) : lemma;
	};

	getClassName = () => {
		const { lemma } = this.props;
		let family = null;
		if ( this.props.settings.highlightWordsWith === 'family' ) {
			family = getFamily( lemma );
		}

		if ( lemma === 'added' ) {
			return classnames( lemma );
		}

		if( this.props.searchSelect ) {
			return classnames( lemma, family, styles.selectSingle );
		}

		return classnames( lemma, family, styles.single );
	};

	render() {
		const { lemma } = this.props;
		return (
			<span
				className={ this.getClassName() }
				onMouseOver={ this.highlightWord }
				onMouseOut={ this.clearHighlightWord }
				onClick={ this.selectWord }
				title={ this.getTitle() }
				style={ this.wordStyle() }
				key={ lemma }
				>
				{ this.getWord() }
			</span>
		);
	}
}

export default withStyles( styles )( WordSingle );

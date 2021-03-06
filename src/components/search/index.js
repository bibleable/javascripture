// External dependencies
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';

// Internal dependencies
import {
	addSearch,
	removeSearch,
	toggleSearch,
	closeAdvancedSearch,
	openAdvancedSearch,
	settingsChange,
	activateSearchSelect,
	updateSearchForm,
	clearSearchForm,
	fetchData,
	selectWord,
} from '../../actions'
import PickerSvg from '../svg/picker.js';
import styles from './styles.scss';
import SearchResults from './search-results';

class Search extends React.Component{
	change = ( event ) => {
		this.props.updateSearchForm( event.target.name, event.target.value );
	};

	selectChange = ( event ) => {
		this.change( event );
		this.props.fetchData( event.target.value );
	};

	toggle = ( event ) => {
		this.props.updateSearchForm( event.target.name, event.target.checked );
	};

	reset = ( event ) => {
		event.preventDefault();
		this.props.clearSearchForm();
	};

	submit = ( event ) => {
		event.preventDefault();
		this.props.addSearch( this.props.searchForm );
	};

	showAdvanced = () => {
		if ( this.props.searchAdvanced ) {
			this.props.closeAdvancedSearch();
		} else {
			this.props.openAdvancedSearch();
		}
	};

	changeExpandedResultsSetting = () => {
		if ( this.props.settings.expandedSearchResults ) {
			this.props.collapseSearchResults();
		} else {
			this.props.expandSearchResults();
		}
	};

	toggleDetails = ( terms ) => {
		this.props.toggleSearch( terms );
	};

	removeWord = ( terms ) => {
		this.props.removeSearch( terms );
	};

	searchButtonText = () => {
		if ( this.isSubmitButtonDisabled() ) {
			return 'Loading ' + this.props.searchForm.version + '...';
		}

		return 'Search';
	};

	isSubmitButtonDisabled = () => {
		const data = this.props.data[ this.props.searchForm.version ];
		return ! data || Object.keys( data ).length === 0;
	};

	pickerButton( field ) {
		return (
			<button
				className={ styles.pickerButton }
				type="button" onClick={ this.props.activateSearchSelect.bind( this, field ) }
				title="Use this to select the term you want to search for.">
				<PickerSvg />
			</button>
		);
	}

	renderAdvanced() {
		const text = this.props.searchAdvanced ? 'Hide advanced' : 'Show advanced';
		return (
			<fieldset className={ styles.advanced }><a onClick={ this.showAdvanced }>{ text }</a></fieldset>
		);
	}

	render() {
		return (
			<div>
				<form className={ styles.search } onSubmit={ this.submit }>
					<fieldset>
						<label htmlFor="word" className="has-placeholder">Word</label>
						<input type="text" name="word" placeholder="Word" onChange={ this.change } value={ this.props.searchForm.word } />
						{ this.pickerButton( 'word' ) }
					</fieldset>
					{ this.props.searchAdvanced && (
						<div>
							<fieldset>
								<label htmlFor="lemma" className="has-placeholder">Strongs number</label>
								<input type="text" name="lemma" placeholder="Strongs number" onChange={ this.change } value={ this.props.searchForm.lemma } />
								{ this.pickerButton( 'lemma' ) }
							</fieldset>
							<fieldset>
								<label htmlFor="morph" className="has-placeholder">Morphology</label>
								<input type="text" name="morph" placeholder="Morphology" onChange={ this.change } value={ this.props.searchForm.morph } />
								{ this.pickerButton( 'morph' ) }
							</fieldset>
							<fieldset>
								<label htmlFor="version">Version:</label> <select name="version" onChange={ this.selectChange } value={ this.props.searchForm.version }>
									{ Object.keys( this.props.versions ).map( ( version, index ) => (
										<option value={ version } key={ index }>{ version }</option>
									) ) }
								</select>
							</fieldset>
							<fieldset>
								<label htmlFor="clusivity">Look for</label> <select name="clusivity" onChange={ this.change } value={ this.props.searchForm.clusivity }>
									<option value="exclusive">all</option>
									<option value="inclusive">any</option>
								</select> <label htmlFor="range">terms in a</label> <select name="range" onChange={ this.change } value={ this.props.searchForm.range }>
									<option>word</option>
									<option>verse</option>
									<option>chapter</option>
								</select>
							</fieldset>
							<fieldset>
								<label>Match whole word?</label> <input type="checkbox" name="strict" onChange={ this.toggle } value={ this.props.searchForm.strict } />
							</fieldset>
							<fieldset>
								<label>Show the verse for context:</label> <input type="checkbox" name="expandedSearchResults" checked={ this.props.settings.expandedSearchResults } onChange={ this.changeExpandedResultsSetting } />
							</fieldset>
						</div>
					) }
					{ this.renderAdvanced() }
					<fieldset>
						<input type="submit" value={ this.searchButtonText() } disabled={ this.isSubmitButtonDisabled() } />
						<input type="reset" value="Reset" onClick={ this.reset } />
					</fieldset>
				</form>
				<SearchResults />
			</div>
		);
	}
}

Search.propTypes = {};

const mapStateToProps = ( state, ownProps ) => {
	return {
		searchAdvanced: state.searchAdvanced,
		searchTerms: state.searchTerms,
		settings: state.settings,
		searchForm: state.searchForm,
		versions: bible.Data.supportedVersions,
		data: state.data,
	};
};

const isSimpleLemmaSearch = ( { lemma, word, morph, clusivity, range } ) => {
	return lemma && lemma.indexOf( ' ' ) < 1 && ! word && ! morph && clusivity === 'exclusive' && range === 'verse';
};

const mapDispatchToProps = ( dispatch, ownProps ) => {
	javascripture.reactHelpers.dispatch = dispatch;
	return {
		updateSearchForm: ( name, value ) => {
			dispatch( updateSearchForm( name, value ) );
		},
		addSearch: ( terms ) => {
			if ( isSimpleLemmaSearch( terms ) ) {
				dispatch( selectWord( terms ) );
			} else {
				dispatch( addSearch( terms, 'search' ) );
			}
			dispatch( clearSearchForm() );
		},
		removeSearch: ( terms ) => {
			dispatch( removeSearch( terms ) );
		},
		toggleSearch: ( terms ) => {
			dispatch( toggleSearch( terms ) );
		},
		openAdvancedSearch: () => {
			dispatch( openAdvancedSearch() );
		},
		closeAdvancedSearch: () => {
			dispatch( closeAdvancedSearch() );
		},
		expandSearchResults: () => {
			dispatch( settingsChange( 'expandedSearchResults', true ) );
		},
		collapseSearchResults: () => {
			dispatch( settingsChange( 'expandedSearchResults', false ) );
		},
		activateSearchSelect: ( mode ) => {
			dispatch( activateSearchSelect( mode ) );
		},
		clearSearchForm: () => {
			dispatch( clearSearchForm() );
		},
		fetchData: ( key ) => {
			dispatch( fetchData( key ) );
		},
	}
};

const SearchContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)( Search )

export default withStyles( styles )( SearchContainer );

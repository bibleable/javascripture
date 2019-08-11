		// External
import { connect } from 'react-redux';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';

// Internal
import SearchBlock from '../components/search/search-block';
import { setCurrentVerse } from '../actions';

function getSearchResults( searchResults, terms ) {
	const searchResultsData = searchResults.find( searchResult => isEqual( searchResult.terms, terms ) );

	if ( searchResultsData ) {
		return searchResultsData.results;
	}
}

const mapStateToProps = ( state, ownProps ) => {
	return {
		results: getSearchResults( state.searchResults, ownProps.terms )
	};
};

const mapDispatchToProps = ( dispatch, ownProps ) => {
	return {
		setCurrentVerse: ( index ) => {
			dispatch( setCurrentVerse( ownProps.terms, index ) );
		},
	}
};

const SearchBlockContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)( SearchBlock )

export default SearchBlockContainer;

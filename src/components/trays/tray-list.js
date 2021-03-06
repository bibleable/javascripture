// External
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';

// Internal
import { toggleTray, toggleSidebar } from '../../actions'
import styles from './styles.scss';
import Search from '../search';
import BookmarksTray from './bookmarks';
import SettingsTray from './settings';
import ReferenceInfo from './reference-info';
import ReferenceSelector from '../reference-selector';
import WordDetails from '../word-details';

function getComponent( componentString ) {
	switch ( componentString ) {
		case 'WordTray':
			return <WordDetails />

		case 'GotoTray':
			return <ReferenceSelector />

		case 'SearchTray':
			return <Search />

		case 'BookmarksTray':
			return <BookmarksTray />

		case 'SettingsTray':
			return <SettingsTray />

		case 'ReferenceInfo':
			return <ReferenceInfo />
	}
}

class TrayList extends React.Component{
	render() {
		const { trays, filter, onTrayClick } = this.props;

		return (
			<div className={ styles.trayList }>
				{ trays.map( tray =>
					<div
						key={ tray.id }
						className={ tray.visible ? styles.visible : styles.hidden }
					>
						<div className={ styles.tray }>
							{ getComponent( tray.component ) }
						</div>
					</div>
				) }
			</div>
		);
	}
};

TrayList.propTypes = {
	trays: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		visible: PropTypes.bool.isRequired,
		text: PropTypes.string.isRequired
	}).isRequired).isRequired
};

const mapStateToProps = ( state ) => {
	return {
		trays: state.trays,
		filter: state.trayVisibilityFilter,
	}
}

const mapDispatchToProps = ( dispatch ) => {
	return {
		onTrayClick: ( id ) => {
			console.log('on clock');
			dispatch( toggleTray( id ) )
			dispatch( toggleSidebar() )
		},
	}
}

const VisibleTrayList = connect(
	mapStateToProps,
	mapDispatchToProps
)( TrayList )

export default withStyles( styles )( VisibleTrayList );

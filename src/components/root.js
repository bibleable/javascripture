// External
import React from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Sidebar from 'react-sidebar';
import { useDispatch, useSelector } from 'react-redux';

// Internal
import Dock from './dock';
import ReferenceWrapper from '../components/reference-wrapper';
import KeyboardShortcuts from './keyboard-shortcuts';
import Trays from './trays';
import TrayList from './trays/tray-list';
import WordHighlight from './word-highlight';
import styles from './root.scss';
import { toggleSidebar } from '../actions'

const Root = ( { highlightedWord } ) => {
	const dispatch = useDispatch();
	const sidebarOpen = useSelector( state => state.sidebar );
	const getBodyStyles = () => {
		const fontFamily = useSelector( state => state.settings.fontFamily );
		const fontSize = useSelector( state => state.settings.fontSize );

		var bodyStyles = 'body { ';
		bodyStyles += 'font-family: ' + fontFamily + ';';
		bodyStyles += 'font-size: ' + fontSize + ';';
		bodyStyles += '}';
		return bodyStyles;
	};

	return (
		<Sidebar
			sidebar={
				<Trays>
					<TrayList />
				</Trays>
			}
			open={ sidebarOpen }
			onSetOpen={ () => dispatch( toggleSidebar() ) }
			styles={{
				sidebar: { background: "white", overflowY: "none", width: "320px", zIndex: "10" },
				overlay: { disply: "none", bottom: "auto", right: "auto" },
				content: { background: "white" },
			}}
		>
			<div className={ styles.root }>
				<style>{ getBodyStyles() }</style>
				<KeyboardShortcuts />
				<WordHighlight word={ highlightedWord } />
				<Dock />
				<ReferenceWrapper />
			</div>
		</Sidebar>
	)
};

export default withStyles( styles )( Root );

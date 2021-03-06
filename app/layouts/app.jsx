import React from 'react';
import LeftNav from 'material-ui/lib/left-nav';
import { VBox, ScrollView } from 'react-layout-components';

import SideMenu from '../components/side_menu';
import ApplicationBar from '../components/application_bar';
import SnackbarNotifications from '../components/snackbar_notifications';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {sidebarOpen: false};
    }

    onSetSidebarOpen(open) {
        this.setState({sidebarOpen: open});
    }

    toggleSidebar() {
        this.setState({sidebarOpen: !this.state.sidebarOpen});
    }

    render() {
        return (
            <VBox style={{position: "fixed", top: 0, bottom: 0, left: 0, right: 0}}>
                <SnackbarNotifications />
            <LeftNav docked={false} width={280} open={this.state.sidebarOpen} onRequestChange={open => this.onSetSidebarOpen(open)}>
            <SideMenu />
            </LeftNav>
            <ApplicationBar onMenuIconTouchTap={() => this.toggleSidebar()} />
            <ScrollView flexGrow={1}>
            {this.props.children}
            </ScrollView>
            </VBox>
        );
    }
}

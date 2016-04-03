import React from 'react';
import { LeftNav, AppBar } from 'material-ui';
import { Page } from 'react-layout-components';

import SideMenu from '../components/side_menu';

export default class App extends React.Component<any, any> {
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
        return <Page>
            <LeftNav docked={false} open={this.state.sidebarOpen} onRequestChange={open => this.onSetSidebarOpen(open)}>
                <SideMenu />
            </LeftNav>
            <AppBar title="Coeo" onLeftIconButtonTouchTap={this.toggleSidebar.bind(this)} />
            {this.props.children}
            </Page>
    }
}

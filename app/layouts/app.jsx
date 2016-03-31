import  * as React from 'react';
import { LeftNav, AppBar } from 'material-ui';
var injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();
var layout = require('react-layout-components');

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
        return <layout.Page>
            <LeftNav docked={false} open={this.state.sidebarOpen} onRequestChange={open => this.onSetSidebarOpen(open)}>
            </LeftNav>
            <AppBar title="Coeo" onLeftIconButtonTouchTap={this.toggleSidebar.bind(this)} />
            {this.props.children}
            </layout.Page>
    }
}

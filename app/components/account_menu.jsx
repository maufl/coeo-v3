import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { ScrollView, VBox, Box } from 'react-layout-components';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';

export default class AccountMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let items;
        if (this.props.user) {
            items = [
                <MenuItem key="settings" containerElement={<Link to="/settings" />} primaryText="Settings" />
            ];
        } else {
            items = [
                <MenuItem key="login" containerElement={<Link to="/login" />} primaryText="Login" />,
                <MenuItem key="signup" containerElement={<Link to="/signup" />} primaryText="Signup" />
            ];
        }
        return (
            <Menu>
                {items}
            </Menu>
        );
    }
}
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { ScrollView, VBox, Box } from 'react-layout-components';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Settings from 'material-ui/lib/svg-icons/action/settings';

export default class AccountMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let items;
        if (this.props.user) {
            items = [
                <MenuItem
                    key="settings"
                    innerDivStyle={{justifyContent: 'inherit'}}
                    containerElement={<Link to="/settings" />}
                    leftIcon={<Settings />}
                    primaryText="Settings" />
            ];
        } else {
            items = [
                <MenuItem key="login" innerDivStyle={{justifyContent: 'inherit'}} ontainerElement={<Link to="/login" />} primaryText="Login" />,
                <MenuItem key="signup" innerDivStyle={{justifyContent: 'inherit'}} containerElement={<Link to="/signup" />} primaryText="Signup" />
            ];
        }
        return (
            <Menu>
                {items}
            </Menu>
        );
    }
}
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';

import AppBar from 'material-ui/lib/app-bar';
import AutoComplete from 'material-ui/lib/auto-complete';
import MenuItem from 'material-ui/lib/menus/menu-item';

import { maybeGet } from '../state/objects';

class ApplicationBar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (this.props.user) {
            this.props.loadFriends(this.props.user, this.props.friendList);
        }
    }

    shouldComponentUpdate(nextProps) {
        const friends = Object.keys(this.props.friendList || {}),
              nextFriends = Object.keys(nextProps.friendList || {})
        if (this.props.user != nextProps.user && nextProps.user
         || ! _.isEqual(friends, nextFriends)) {
            this.props.loadFriends(nextProps.user, nextProps.friendList);
        }
        return true;
    }

    render() {
        const friendList = this.props.friendList;
        const dataSource = Object.keys(friendList || {}).map( friend => {
            const {
                data: {
                    fullName
                } = {}
            } = friendList[friend] || {};
            return {
                text: fullName || friend,
                searchText: `${friend} ${fullName}`,
                value: (
                    <MenuItem
                        primaryText={fullName || friend}
                        containerElement={<Link to={`/u/${friend}`} />}
                    />
                )
            }
        })
        return (
            <AppBar title="Coeo" onLeftIconButtonTouchTap={() => this.props.onMenuIconTouchTap()}>
                <AutoComplete name="search" dataSource={dataSource} filter={(searchText, key, item) => searchText !== '' && item.searchText.indexOf(searchText) !== -1} />
            </AppBar>
        );
    }
}

const mapStateToProps = (state) => {
    let user = state.session.user;
    if (!user) {
        return {};
    }
    let friends = state.objects[`${user}/cfg/groups/friends`];
    if (!friends) {
        return { user };
    }
    const friendList = [];
    const {
        data: {
            members = []
        }={}
    } = friends;
    members.forEach(friend => friendList[friend] = state.objects[`${friend}/soc/me`]);
    return {
        user,
        friendList
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadFriends: (user, friendList) => {
            dispatch(maybeGet(`${user}/cfg/groups/friends`));
            Object.keys(friendList || {}).forEach( friend => dispatch(maybeGet(`${friend}/soc/me`)) );
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationBar);
import React from 'react';
import { connect } from 'react-redux';

import RaisedButton from 'material-ui/lib/raised-button';
import PersonAdd from 'material-ui/lib/svg-icons/social/person-add';
import HighlightOff from 'material-ui/lib/svg-icons/action/highlight-off';

import { maybeGet, update } from '../state/objects';

class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        props.loadFriendsGroup();
    }

    render() {
        let {
            user,
            counterpart,
            friendsGroup: {
                data: {
                    members: friends
                }={}
            }={data:{}}
        } = this.props;
        if (friends.indexOf(counterpart) >= 0) {
            return <RaisedButton
                       label="Remove friend"
                       secondary={true}
                       icon={<HighlightOff />}
                       onTouchTap={() => this.props.removeFriend(friends)}
                   />;
        } else {
            return <RaisedButton
                       label="Add friend"
                       primary={true}
                       icon={<PersonAdd />}
                       onTouchTap={() => this.props.addFriend(friends)}
                   />;
        }
    }
}

const mapStateToProps = (state, props) => {
    return {
        friendsGroup: state.objects[`${props.user}/cfg/groups/friends`]
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadFriendsGroup: () => dispatch(maybeGet(`${props.user}/cfg/groups/friends`)),
        addFriend: (existingFriends) => dispatch(update(`${props.user}/cfg/groups/friends`, { data: { members: [props.counterpart, ...existingFriends] }})),
        removeFriend: (existingFriends) => {
            existingFriends.splice(existingFriends.indexOf(props.counterpart), 1);
            dispatch(update(`${props.user}/cfg/groups/friends`, { data: { members: existingFriends }}));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendButton);
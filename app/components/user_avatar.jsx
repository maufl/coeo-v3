import React from 'react';
import { connect } from 'react-redux';

import Avatar from 'material-ui/lib/avatar';
import SocialPerson  from 'material-ui/lib/svg-icons/social/person';

import { maybeRead } from '../state/attachments';

class UserAvatar extends React.Component {
    componentWillMount() {
        if (this.props.user) {
            this.props.loadProfilePhoto();
        }
    }

    render() {
        let {
            profilePhoto,
            style,
            size
        } = this.props;
        if (profilePhoto) {
            return <Avatar size={size} style={style} src={profilePhoto.url} />;
        } else {
            return <Avatar size={size} style={style} icon={<SocialPerson />} />;
        }
    }
}

const mapStateToProps = (state, props) => {
    return {
        profilePhoto: state.attachments[`${props.user}/soc/photos/profile`]
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadProfilePhoto: () => dispatch(maybeRead(`${props.user}/soc/photos/profile`))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAvatar);
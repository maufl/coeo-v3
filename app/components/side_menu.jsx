import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, VBox } from 'react-layout-components';
import { Avatar } from 'material-ui';
import SocialPerson  from 'material-ui/lib/svg-icons/social/person';

import { maybeGet } from '../state/objects';
import { maybeRead } from '../state/attachments';

class SideMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (this.props.currentUser) {
            this.props.loadSocial(this.props.currentUser);
        }
    }

    shouldComponentUpdate(nextProps, _) {
        if (this.props.currentUser !== nextProps.currentUser && nextProps.currentUser) {
            this.props.loadSocial(nextProps.currentUser);
        }
        return true;
    }

    render() {
        let {
            socialMe: { data: { fullName } = {}} = {},
            profilePhoto
        } = this.props;
        return (
            <ScrollView>
                <VBox style={ { "backgroundImage": "url('https://unsplash.it/300/200?image=898&gravity=center')", "padding": "16px" } }>
                    <Avatar style={ {"marginTop": "16px" } }
                            src={profilePhoto ? URL.createObjectURL(profilePhoto.blob) : null}
                            icon={profilePhoto ?  null : <SocialPerson />} />
                    <div style={ {"marginTop": "8px"} }>{fullName}</div>
                </VBox>
            </ScrollView>
        );
    }
}

let mapStateToProps = state => {
    let user = state.session.user;
    if (!user) {
        return {}
    }
    return {
        currentUser: user,
        socialMe: state.objects[user+'/soc/me'],
        profilePhoto: state.attachments[user+'/soc/photos/profile']
    }
}

let mapDispatchToProps = dispatch => {
    return {
        loadSocial: user => {
            dispatch(maybeGet(user+'/soc/me'));
            dispatch(maybeRead(user+'/soc/photos/profile'));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
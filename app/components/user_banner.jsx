import React from 'react';
import { connect } from 'react-redux';

import { Card, CardHeader, CardMedia, CardActions } from 'material-ui/lib/card';

import { maybeGet } from '../state/objects';
import { maybeRead } from '../state/attachments';

import UserAvatar from './user_avatar';
import FriendButton from './friend_button';

class UserBanner extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.loadSocial();
    }

    render() {
        let {
            user,
            currentUser,
            me: { data: { fullName } ={} } ={},
            motto: { data: motto } ={},
            coverPhoto,
        } = this.props;
        let avatar = <UserAvatar user={user} />;
        let mediaContent = <img src={"https://unsplash.it/900/200"} />;
        let actions;
        if (coverPhoto) {
           mediaContent = <div style={{
                    maxWidth: 900,
                    height: 200,
                    backgroundImage: 'url(' + coverPhoto.url + ')',
                    backgroundSize: "cover",
                    backgroundPosition: "center center"
               }} />;
        }
        if (currentUser && currentUser != user) {
            actions = <CardActions style={{textAlign: 'right'}}><FriendButton user={currentUser} counterpart={user} /></CardActions>;
        }
        return (
                <Card style={{width: "100%"}}>
                    <CardMedia
                        overlay={<CardHeader avatar={avatar} title={fullName} subtitle={motto} />} >
                        {mediaContent}
                    </CardMedia>
                    {actions}
                </Card>
            );
    }
}

const mapStateToProps = (state, props) => {
    let user = props.user;
    return {
        currentUser: state.session.user,
        me: state.objects[user+'/soc/me'],
        motto: state.objects[user+'/soc/me/motto'],
        coverPhoto: state.attachments[user+'/soc/photos/cover'],
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadSocial: () => {
            let user = props.user;
            dispatch(maybeGet(user+'/soc/me'));
            dispatch(maybeGet(user+'/soc/me/motto'));
            dispatch(maybeRead(user+'/soc/photos/cover'));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserBanner);
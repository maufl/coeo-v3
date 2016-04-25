import React from 'react';
import { connect } from 'react-redux';

import { Card, CardHeader, CardMedia } from 'material-ui/lib/card';

import { maybeGet } from '../state/objects';
import { maybeRead } from '../state/attachments';

import UserAvatar from './user_avatar';

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
            me: { data: { fullName } ={} } ={},
            motto: { data: motto } ={},
            coverPhoto,
        } = this.props;
        let avatar = <UserAvatar user={user} />;
        let mediaContent = <img src={"https://unsplash.it/900/200"} />;
        if (coverPhoto) {
           mediaContent = <div style={{
                    width: 900,
                    height: 200,
                    backgroundImage: 'url(' + coverPhoto.url + ')',
                    backgroundSize: "cover",
                    backgroundPosition: "center center"
               }} />;
        }
        return (
                <Card style={{width: "100%"}}>
                    <CardMedia
                        overlay={<CardHeader avatar={avatar} title={fullName} subtitle={motto} />} >
                        {mediaContent}
                    </CardMedia>
                </Card>
            );
    }
}

const mapStateToProps = (state, props) => {
    let user = props.user;
    return {
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
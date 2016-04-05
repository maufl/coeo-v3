import React from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardMedia } from 'material-ui';
import { Container } from 'react-layout-components';
import { Avatar } from 'material-ui';
import SocialPerson  from 'material-ui/lib/svg-icons/social/person';

import { maybeGet } from '../state/objects';
import { maybeRead } from '../state/attachments';

class MePage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.loadSocial(this.props.user);
    }

    render() {
        let {
            me: { data: { fullName } ={} } ={},
            motto: { data: motto } ={},
            profilePhoto,
            coverPhoto
        } = this.props;
        let avatar = <Avatar src={profilePhoto ? URL.createObjectURL(profilePhoto.blob) : null}
                             icon={profilePhoto ? null : <SocialPerson />} />;
        let mediaContent = null;
        if (coverPhoto) {
           mediaContent = <div style={{
                    width: 900,
                    height: 200,
                    backgroundImage: 'url(' + URL.createObjectURL(coverPhoto.blob) + ')',
                    backgroundSize: "cover",
                    backgroundPosition: "center center"
               }} />;
        } else {
            mediaContent = <img src={"https://unsplash.it/900/200"} />;
        }
        return (
            <Container maxWidth={900} margin="20px auto">
                <Card style={{width: "100%"}}>
                    <CardMedia
                        overlay={<CardHeader avatar={avatar} title={fullName} subtitle={motto} />} >
                        {mediaContent}
                    </CardMedia>
                </Card>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    let user = state.session.user;
    if (!user) {
        return {};
    }
    return {
        user: user,
        me: state.objects[user+'/soc/me'],
        motto: state.objects[user+'/soc/me/motto'],
        profilePhoto: state.attachments[user+'/soc/photos/profile'],
        coverPhoto: state.attachments[user+'/soc/photos/cover']
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadSocial: (user) => {
            dispatch(maybeGet(user+'/soc/me'));
            dispatch(maybeGet(user+'/soc/me/motto'));
            dispatch(maybeRead(user+'/soc/photos/profile'));
            dispatch(maybeRead(user+'/soc/photos/cover'));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MePage);

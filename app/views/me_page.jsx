import React from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardMedia, CardText } from 'material-ui';
import { Container, VBox } from 'react-layout-components';
import { Avatar } from 'material-ui';
import SocialPerson  from 'material-ui/lib/svg-icons/social/person';

import { maybeGet } from '../state/objects';
import { maybeRead } from '../state/attachments';
import { maybeList } from '../state/children';

import PostCard from '../components/post_card';
import UserAvatar from '../components/user_avatar';

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
            coverPhoto,
            postList
        } = this.props;
        let avatar = <UserAvatar user={this.props.user} />;
        let mediaContent = null;
        if (coverPhoto) {
           mediaContent = <div style={{
                    width: 900,
                    height: 200,
                    backgroundImage: 'url(' + coverPhoto.url + ')',
                    backgroundSize: "cover",
                    backgroundPosition: "center center"
               }} />;
        } else {
            mediaContent = <img src={"https://unsplash.it/900/200"} />;
        }
        return (
            <VBox maxWidth={900} style={{ margin: "8px auto"}}>
                <Card style={{width: "100%"}}>
                    <CardMedia
                        overlay={<CardHeader avatar={avatar} title={fullName} subtitle={motto} />} >
                        {mediaContent}
                    </CardMedia>
                </Card>
                <VBox>
                {(postList || []).map( (post, index) =>  <PostCard style={{marginTop: "16px"}} postURL={post} key={index} />)}
                </VBox>
            </VBox>
        );
    }
}

const mapStateToProps = (state) => {
    let user = state.session.user;
    if (!user) {
        return {};
    }
    let postList = state.children[user+'/soc/feed/blog'];
    return {
        user: user,
        me: state.objects[user+'/soc/me'],
        motto: state.objects[user+'/soc/me/motto'],
        coverPhoto: state.attachments[user+'/soc/photos/cover'],
        postList
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadSocial: (user) => {
            dispatch(maybeGet(user+'/soc/me'));
            dispatch(maybeGet(user+'/soc/me/motto'));
            dispatch(maybeRead(user+'/soc/photos/cover'));
            dispatch(maybeList(user+'/soc/feed/blog'));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MePage);

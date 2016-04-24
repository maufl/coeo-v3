import React from 'react';
import { connect } from 'react-redux';

import { Card, CardHeader, CardMedia } from 'material-ui/lib/card';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import { VBox } from 'react-layout-components';

import { maybeGet } from '../state/objects';
import { maybeRead } from '../state/attachments';

import UserAvatar from '../components/user_avatar';
import Feed from '../components/feed';
import PostDialog from '../components/post_dialog';

class MePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        this.props.loadSocial(this.props.user);
    }

    render() {
        let {
            user,
            me: { data: { fullName } ={} } ={},
            motto: { data: motto } ={},
            coverPhoto,
        } = this.props;
        if (! user) {
            return;
        }
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
                    <PostDialog open={this.state.postDialogOpen} feedURL={`${user}/soc/feed/blog`} />
                    <FloatingActionButton style={{position: "absolute", bottom: 32, right: 32}} onTouchTap={() => this.setState({postDialogOpen: true})}>
                        <ContentAdd />
                    </FloatingActionButton>
                    <Feed feedURL={`${user}/soc/feed/blog`} />
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
    return {
        user: user,
        me: state.objects[user+'/soc/me'],
        motto: state.objects[user+'/soc/me/motto'],
        coverPhoto: state.attachments[user+'/soc/photos/cover'],
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadSocial: (user) => {
            dispatch(maybeGet(user+'/soc/me'));
            dispatch(maybeGet(user+'/soc/me/motto'));
            dispatch(maybeRead(user+'/soc/photos/cover'));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MePage);

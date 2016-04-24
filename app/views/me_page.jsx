import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Card, CardHeader, CardMedia, CardText } from 'material-ui/lib/card';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import { Container, VBox } from 'react-layout-components';

import { maybeGet, create } from '../state/objects';
import { maybeRead } from '../state/attachments';
import { maybeList } from '../state/children';

import PostCard from '../components/post_card';
import UserAvatar from '../components/user_avatar';

class MePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        this.props.loadSocial(this.props.user);
    }

    createPost() {
        if (this.state.newPostText) {
            this.props.createPost(this.props.user, this.state.newPostText);
            this.setState({
                newPostText: '',
                postDialogOpen: false
            })
        }
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
        let postActions = [
            <FlatButton label="Cancel" secondary={true} onTouchTap={()=>this.setState({postDialogOpen: false})} />,
            <FlatButton label="Post" primary={true} onTouchTap={()=>this.createPost()} />
        ];
        let postDialog = (
            <Dialog title="Submit new post"
                    modal={false}
                    open={this.state.postDialogOpen}
                    onRequestClose={()=>this.setState({postDialogOpen: false})}
                    actions={postActions}>
                <TextField name="newPostText" fullWidth={true} floatingLabelText="Write something witty .." multiLine={true} rows={3} maxRows={6} value={this.state.newPostText} onChange={(e) => this.setState({newPostText: e.target.value})} />
            </Dialog>
        );
        return (
            <VBox maxWidth={900} style={{ margin: "8px auto"}}>
                <Card style={{width: "100%"}}>
                    <CardMedia
                        overlay={<CardHeader avatar={avatar} title={fullName} subtitle={motto} />} >
                        {mediaContent}
                    </CardMedia>
                </Card>
                <VBox>
                    {postDialog}
                    <FloatingActionButton style={{position: "absolute", bottom: 32, right: 32}} onTouchTap={() => this.setState({postDialogOpen: true})}>
                        <ContentAdd />
                    </FloatingActionButton>
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

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadSocial: (user) => {
            dispatch(maybeGet(user+'/soc/me'));
            dispatch(maybeGet(user+'/soc/me/motto'));
            dispatch(maybeRead(user+'/soc/photos/cover'));
            dispatch(maybeList(user+'/soc/feed/blog'));
        },
        createPost: (user, text) => {
            let teaser = text.replace(/[^a-zA-Z0-9 ]/,'').split(/\s+/).slice(0, 3).join('-');
            let postName = `${moment().format('YYYY-MM-DD')}-${teaser}`;
            dispatch(create(`${user}/soc/feed/blog/${postName}`, { data: text }))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(MePage);

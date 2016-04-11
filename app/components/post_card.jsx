import React from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';

import moment from 'moment';

import { Card, CardText, CardHeader } from 'material-ui/lib/card';
import Divider from 'material-ui/lib/divider';
import TextField from 'material-ui/lib/TextField';
import RaisedButton from 'material-ui/lib/raised-button';

import { maybeGet, create } from '../state/objects';
import { maybeList } from '../state/children';

import UserAvatar from './user_avatar';
import Comment from './comment';

class PostCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        this.props.loadPost();
    }

    postComment() {
        if (this.state.newCommentText) {
            this.props.createComment(this.state.newCommentText);
            this.setState({
                newCommentText: ''
            })
        }
    }

    render() {
        let {
            style,
            comments,
            post: {
                created: postCreated,
                owner: author,
                data: text
            }={},
            author: {
                data: {
                    fullName: authorName
                }={}
            }={}
        } = this.props;
        let time = moment(postCreated).fromNow();
        return (
            <Card style={style}>
                <CardHeader
                    avatar={<UserAvatar user={author}/>}
                    title={authorName}
                    subtitle={time} />
                <CardText>
                    <ReactMarkdown source={text || ''}/>
                </CardText>
                <Divider />
                {(comments || []).map((commentURL) => <Comment commentURL={commentURL} />)}
                <CardText>
                    <TextField style={{marginRight: 24}} name="newCommentText" multiLine={true} rows={2} maxRows={4}
                               value={this.state.newCommentText} onChange={(e) => this.setState({newCommentText: e.target.value})} />
                    <RaisedButton primary={true} label="comment" onTouchTap={() => this.postComment()} />
                </CardText>
            </Card>
        );
    }
}

const mapStateToProps = (state, props) => {
    let post = state.objects[props.postURL],
        comments = state.children[props.postURL],
        author;
    if (post) {
        author = state.objects[`${post.owner}/soc/me`];
    }
    return { post, author, comments };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadPost: () => {
            dispatch(maybeGet(props.postURL));
            dispatch(maybeList(props.postURL));
        },
        createComment: (text) => {
            let teaser = text.replace(/[^a-zA-Z0-9 ]/,'').split(/\s+/).slice(0, 3).join('-');
            let commentName = `${moment().format('YYYY-MM-DD')}-${teaser}`;
            dispatch(create(`${props.postURL}/${commentName}`, { data: text }))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostCard);
import React from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';

import moment from 'moment';

import { Card, CardText, CardHeader } from 'material-ui/lib/card';
import Paper from 'material-ui/lib/paper';
import Divider from 'material-ui/lib/divider';
import TextField from 'material-ui/lib/TextField';
import RaisedButton from 'material-ui/lib/raised-button';
import { grey100, grey300 } from 'material-ui/lib/styles/colors';

import { Box } from 'react-layout-components';

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
            isPhone,
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
                <Box column={isPhone}>
                    <Box column flex={1}>
                        <CardHeader
                            avatar={<UserAvatar user={author}/>}
                            title={authorName}
                            subtitle={time}
                            style={{paddingBottom: 0}} />
                        <CardText
                            style={{paddingTop: 0}}>
                            <ReactMarkdown source={text || ''}/>
                        </CardText>
                    </Box>
                    <Box column flex={1} style={{background: grey100, borderLeft: isPhone ? null : `1px solid ${grey300}`, borderTop: isPhone ? `1px solid ${grey300}` : null}}>
                        {(comments || []).map((commentURL) => <Comment commentURL={commentURL} />)}
                        { comments && comments.length > 0 ? <Divider /> : null }
                        <CardText>
                            <TextField name="newCommentText" multiLine={true} rows={2} maxRows={4}
                                       fullWidth={true} floatingLabelText="Add a comment"
                                       value={this.state.newCommentText} onChange={(e) => this.setState({newCommentText: e.target.value})} />
                            { this.state.newCommentText ? <RaisedButton primary={true} label="post comment" onTouchTap={() => this.postComment()} /> : null }
                        </CardText>
                    </Box>
                </Box>
            </Card>
        );
    }
}

const mapStateToProps = (state, props) => {
    let post = state.objects[props.postURL],
        comments = state.children[props.postURL],
        isPhone = state.responsive.isPhone,
        author;
    if (post) {
        author = state.objects[`${post.owner}/soc/me`];
    }
    return { post, author, comments, isPhone };
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
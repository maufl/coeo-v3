import React from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';

import moment from 'moment';

import { Card, CardText, CardHeader } from 'material-ui/lib/card';

import { maybeGet } from '../state/objects';

import UserAvatar from './user_avatar';

class PostCard extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.loadPost();
    }

    render() {
        let {
            style,
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
            </Card>
        );
    }
}

const mapStateToProps = (state, props) => {
    let post = state.objects[props.postURL],
        author;
    if (post) {
        author = state.objects[`${post.owner}/soc/me`];
    }
    return { post, author };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadPost: () => dispatch(maybeGet(props.postURL))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostCard);
import React from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';

import moment from 'moment';

import { Card, CardText, CardHeader } from 'material-ui/lib/card';

import { VBox } from 'react-layout-components';

import { maybeGet } from '../state/objects';

import UserAvatar from './user_avatar';

class Comment extends React.Component {

    componentWillMount() {
        this.props.loadComment();
    }

    render() {
        let {
            style,
            comment: {
                created: commentCreated,
                owner: author,
                data: text
            }={},
            author: {
                data: {
                    fullName: authorName
                }={}
            }={}
        } = this.props;
        let time = moment(commentCreated).fromNow();
        return (
            <VBox style={{style}}>
                <CardHeader
                    avatar={<UserAvatar size={32} user={author}/>}
                    title={authorName}
                    subtitle={time}
                    style={{paddingBottom: 0}} />
                <CardText
                    style={{paddingTop: 0}}>
                    <ReactMarkdown source={text || ''}/>
                </CardText>
            </VBox>
        );
    }
}

const mapStateToProps = (state, props) => {
    let comment = state.objects[props.commentURL],
        author;
    if (comment) {
        author = state.objects[`${comment.owner}/soc/me`];
    }
    return { comment, author };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadComment: () => dispatch(maybeGet(props.commentURL))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment);

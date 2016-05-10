import React from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';

import moment from 'moment';

import ListItem from 'material-ui/lib/lists/list-item';
import Colors from 'material-ui/lib/styles/colors';

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
            <ListItem
                disabled
                leftAvatar={<UserAvatar size={32} user={author} />}
                primaryText={<span>{authorName}&nbsp;<span style={{fontSize: '0.8em', color: Colors.lightBlack}}>{time}</span></span>}
                secondaryText={<ReactMarkdown source={text || ''} />}
            />
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

import React from 'react';
import { connect } from 'react-redux';

import List from 'material-ui/lib/lists/list';
import Divider from 'material-ui/lib/divider';
import Colors from 'material-ui/lib/styles/colors';

import Comment from './comment';

class CommentsList extends React.Component {
    render() {
        let {
            comments = []
        } = this.props;
        return (
            <List style={{backgroundColor: Colors.grey100}}>
                {comments.map(commentURL => <Comment commentURL={commentURL} />)}
            </List>
        );
    }
}

const mapStateToProps = (state, {postURL}) => {
    return { comments: state.children[postURL] };
}

export default connect(mapStateToProps)(CommentsList);

import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';

import { create } from '../state/objects';

class PostDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newPostText: "",
            open: props.open
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({open: nextProps.open});
    }

    createPost() {
        if (this.state.newPostText) {
            this.props.createPost(this.props.user, this.state.newPostText);
            this.setState({
                newPostText: '',
            });
            this.props.onRequestClose();
        }
    }

    render() {
        let postActions = [
            <FlatButton label="Cancel" secondary={true} onTouchTap={()=>this.props.onRequestClose()} />,
            <FlatButton label="Post" primary={true} onTouchTap={()=>this.createPost()} />
        ];
        return (
            <Dialog title="Submit new post"
                    modal={false}
                    open={this.state.open}
                    onRequestClose={()=>this.props.onRequestClose()}
                    actions={postActions}>
                <TextField
                    name="newPostText"
                    fullWidth={true}
                    floatingLabelText="Write something witty .."
                    multiLine={true}
                    rows={3}
                    maxRows={6}
                    value={this.state.newPostText}
                    onChange={(e) => this.setState({newPostText: e.target.value})} />
            </Dialog>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        createPost: (user, text) => {
            let teaser = text.replace(/[^a-zA-Z0-9 ]/,'').split(/\s+/).slice(0, 3).join('-');
            let postName = `${moment().format('YYYY-MM-DD')}-${teaser}`;
            dispatch(create(`${props.feedURL}/${postName}`, { data: text }))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDialog);

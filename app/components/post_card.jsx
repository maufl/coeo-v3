import React from 'react';
import { connect } from 'react-redux';

import { Card, CardText } from 'material-ui/lib/card';

import { maybeGet } from '../state/objects';

class PostCard extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.loadPost();
    }

    render() {
        return (
            <Card>
                <CardText>
                    {this.props.post.data}
                </CardText>
            </Card>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        post: state.objects[props.postURL]
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadPost: () => dispatch(maybeGet(props.postURL))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostCard);
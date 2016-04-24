import React from 'react';
import { connect } from 'react-redux';

import { VBox } from 'react-layout-components';

import PostCard from './post_card';
import { maybeList } from '../state/children';

class Feed extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.loadFeed();
    }

    render() {
        let postList = this.props.postList || [];
        return (<VBox>
            {postList.map( (post, index) =>  <PostCard style={{marginTop: "16px"}} postURL={post} key={index} />)}
        </VBox>);
    }
}

const mapStateToProps = (state, props) => {
    let postList = state.children[props.feedURL];
    return { postList };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        loadFeed: () => dispatch(maybeList(props.feedURL))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
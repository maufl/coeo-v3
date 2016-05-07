import React from 'react';
import { connect } from 'react-redux';

import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import { VBox } from 'react-layout-components';

import Feed from '../components/feed';
import PostDialog from '../components/post_dialog';
import UserBanner from '../components/user_banner';

class MePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { postDialogOpen: false };
    }

    render() {
        let { user } = this.props;
        if (! user) {
            return <div />;
        }
        return (
            <VBox maxWidth={900} style={{ margin: "8px auto"}}>
                <UserBanner user={user} />
                <PostDialog open={this.state.postDialogOpen} onRequestClose={() => this.setState({postDialogOpen: false})} feedURL={`${user}/soc/feed/blog`} />
                <FloatingActionButton style={{position: "absolute", bottom: 32, right: 32, zIndex: 10}} onTouchTap={() => this.setState({postDialogOpen: true})}>
                    <ContentAdd />
                </FloatingActionButton>
                <Feed
                    phone={this.context.phone} // TODO: remove this once context works properly, right now it is needed to force an update
                    feedURL={`${user}/soc/feed/blog`} />
            </VBox>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.session.user
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(MePage);

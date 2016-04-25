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
        this.state = {};
    }

    render() {
        let { user } = this.props;
        if (! user) {
            return;
        }
        return (
            <VBox maxWidth={900} style={{ margin: "8px auto"}}>
                <UserBanner user={user} />
                <VBox>
                    <PostDialog open={this.state.postDialogOpen} feedURL={`${user}/soc/feed/blog`} />
                    <FloatingActionButton style={{position: "absolute", bottom: 32, right: 32}} onTouchTap={() => this.setState({postDialogOpen: true})}>
                        <ContentAdd />
                    </FloatingActionButton>
                    <Feed feedURL={`${user}/soc/feed/blog`} />
                </VBox>
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

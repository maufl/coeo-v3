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
        let { user, isPhone } = this.props;
        if (! user) {
            return <div />;
        }
        return (
            <div style={{ margin: "8px auto", maxWidth: 900, width: isPhone ? '100%' : null }}>
                <UserBanner user={user} />
                <PostDialog open={this.state.postDialogOpen} onRequestClose={() => this.setState({postDialogOpen: false})} feedURL={`${user}/soc/feed/blog`} />
                <FloatingActionButton style={{position: "absolute", bottom: 32, right: 32, zIndex: 10}} onTouchTap={() => this.setState({postDialogOpen: true})}>
                    <ContentAdd />
                </FloatingActionButton>
                <Feed feedURL={`${user}/soc/feed/blog`} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.session.user,
        isPhone: state.responsive.isPhone
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(MePage);

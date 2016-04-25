import React from 'react';
import { connect } from 'react-redux';

import { VBox } from 'react-layout-components';

import Feed from '../components/feed';
import UserBanner from '../components/user_banner';

class UserPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { user } = this.props.params;
        return (
            <VBox maxWidth={900} style={{ margin: "8px auto"}}>
                <UserBanner user={user} />
                <VBox>
                    <Feed feedURL={`${user}/soc/feed/blog`} />
                </VBox>
            </VBox>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
}

const mapDispatchToProps = (dispatch, props) => {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);

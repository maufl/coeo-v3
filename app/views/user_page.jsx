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
        let {
            params: { user },
            isPhone
        } = this.props;
        return (
            <div style={{ margin: "8px auto", maxWidth: 900, width: isPhone ? '100%' : null }}>
                <UserBanner user={user} />
                <VBox>
                    <Feed feedURL={`${user}/soc/feed/blog`} />
                </VBox>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { isPhone: state.responsive.isPhone };
}

const mapDispatchToProps = (dispatch, props) => {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);

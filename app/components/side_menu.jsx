import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, VBox } from 'react-layout-components';
import { Avatar } from 'material-ui';
import SocialPerson  from 'material-ui/lib/svg-icons/social/person';

import { maybeGet } from '../state/objects';

class SideMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (this.props.currentUser) {
            this.props.loadSocial(this.props.currentUser);
        }
    }

    render() {
        let { socialMe: { data: { fullName } = {}} = {}} = this.props;
        return (
            <ScrollView>
                <VBox style={ { "background-image": "url('https://unsplash.it/300/200?blur')", "padding": "16px" } }>
                    <Avatar style={ {"margin-top": "16px" } }  icon={<SocialPerson />} />
                    <div style={ {"margin-top": "8px"} }>{fullName}</div>
                </VBox>
            </ScrollView>
        );
    }
}

let mapStateToProps = state => {
    return {
        currentUser: state.session.user,
        socialMe: state.objects[state.session.user+'/soc/me']
    }
}

let mapDispatchToProps = dispatch => {
    return {
        loadSocial: user => {
            dispatch(maybeGet(user+'/soc/me'))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
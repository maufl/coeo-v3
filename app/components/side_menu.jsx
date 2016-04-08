import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { ScrollView, VBox, Box } from 'react-layout-components';
import { Avatar } from 'material-ui';
import SocialPerson  from 'material-ui/lib/svg-icons/social/person';
import ArrowDropDown from 'material-ui/lib/svg-icons/navigation/arrow-drop-down';
import ArrowDropUp from 'material-ui/lib/svg-icons/navigation/arrow-drop-up';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';

import AccountMenu from './account_menu';

import { maybeGet } from '../state/objects';
import { maybeRead } from '../state/attachments';

class SideMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMenu: props.currentUser ? "" : "accounts"
        };
    }

    componentWillMount() {
        if (this.props.currentUser) {
            this.props.loadSocial(this.props.currentUser);
        }
    }

    shouldComponentUpdate(nextProps, _) {
        if (this.props.currentUser !== nextProps.currentUser && nextProps.currentUser) {
            this.props.loadSocial(nextProps.currentUser);
        }
        return true;
    }

    render() {
        let {
            socialMe: { data: { fullName } = {}} = {},
            profilePhoto
        } = this.props;
        let subMenu;
        if (this.state.selectedMenu === "accounts") {
            subMenu = <AccountMenu user={this.props.currentUser} />;
        }
        return (
            <ScrollView>
                <VBox style={ { "backgroundImage": "url('https://unsplash.it/300/200?image=898&gravity=center')", "padding": "16px" } }>
                    <Avatar style={ {"marginTop": "16px" } }
                            src={profilePhoto ? profilePhoto.url : null}
                            icon={profilePhoto ?  null : <SocialPerson />} />
                    <Box>
                        <Box flex={1} style={ {"marginTop": "8px"} }>{fullName}</Box>
                        <Box>
                            { this.state.selectedMenu === "accounts" ?
                              <ArrowDropUp onClick={() => this.setState({ selectedMenu: "" })}/>
                              : <ArrowDropDown onClick={() => this.setState({ selectedMenu: "accounts" })}/>}
                        </Box>
                    </Box>
                </VBox>
                {subMenu}
            </ScrollView>
        );
    }
}

let mapStateToProps = state => {
    let user = state.session.user;
    if (!user) {
        return {}
    }
    return {
        currentUser: user,
        socialMe: state.objects[user+'/soc/me'],
        profilePhoto: state.attachments[user+'/soc/photos/profile']
    }
}

let mapDispatchToProps = dispatch => {
    return {
        loadSocial: user => {
            dispatch(maybeGet(user+'/soc/me'));
            dispatch(maybeRead(user+'/soc/photos/profile'));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenu);
import React from 'react';
import { connect } from 'react-redux';
import { VBox } from 'react-layout-components';
import { TextField, Card, CardText, CardTitle } from 'material-ui';

import { maybeGet, update } from '../state/objects';
import { maybeRead } from '../state/attachments';

class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
        let {
            me: { data: { fullName } ={} } ={},
            motto: { data: motto } ={},
            profilePhoto,
            coverPhoto,
        } = this.props;
        this.state = {
            fullName,
            motto,
            profilePhoto,
            coverPhoto
        };
    }

    componentWillMount() {
        this.props.loadSocial(this.props.user);
    }

    render() {
        return (
            <VBox fit center>
                <Card style={{width: 900}}>
                    <CardTitle actAsExpander={true} showExpandableButton={true} title="Personal information" />
                    <CardText expandable={true}>
                    <TextField
                        floatingLabelText="Display name"
                        value={this.state.fullName}
                        onChange={(e) => {this.setState({fullName: e.target.value})}}
                        onBlur={() => this.props.updateFullName(this.props.user, this.state.fullName)}
                    />
                    <br />
                    <TextField
                        floatingLabelText="Motto"
                        value={this.state.motto}
                        onChange={(e) => {this.setState({motto: e.target.value})}}
                        onBlur={() => this.props.updateMotto(this.props.user, this.state.motto)}
                    />
                    </CardText>
                </Card>
            </VBox>
        );
    }
}

const mapStateToProps = (state) => {
    let user = state.session.user;
    if (!user) {
        return {};
    }
    return {
        user: user,
        me: state.objects[user+'/soc/me'],
        motto: state.objects[user+'/soc/me/motto'],
        profilePhoto: state.attachments[user+'/soc/photos/profile'],
        coverPhoto: state.attachments[user+'/soc/photos/cover']
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadSocial: (user) => {
            dispatch(maybeGet(user+'/soc/me'));
            dispatch(maybeGet(user+'/soc/me/motto'));
            dispatch(maybeRead(user+'/soc/photos/profile'));
            dispatch(maybeRead(user+'/soc/photos/cover'));
        },
        updateFullName: (user, fullName) => {
            dispatch(update(user+'/soc/me', { data : { fullName }}))
        },
        updateMotto: (user, motto) => {
            dispatch(update(user+'/soc/me/motto', { data: motto }))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);

import React from 'react';
import { connect } from 'react-redux';
import { VBox } from 'react-layout-components';
import { TextField, Card, CardText, CardTitle } from 'material-ui';

import { maybeGet, update } from '../state/objects';
import { maybeRead, write } from '../state/attachments';

let prevent = (e) => {
    e.preventDefault();
    e.stopPropagation();
}

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

    updateProfilePhoto(event) {
        prevent(event);
        if (!(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length === 1)) {
            return;
        }
        let file = event.dataTransfer.files[0];
        this.props.writeProfilePhoto(this.props.user, file);
    }

    render() {
        return (
            <VBox center>
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
                <Card style={{width: 900}}>
                    <CardTitle actAsExpander={true} showExpandableButton={true} title="Photos" />
                    <CardText expandable={true}>
                        <img style={{maxWidth: 900}}
                             src={this.state.profilePhoto.url}
                             onDragOver={prevent}
                             onDrop={(e) => this.updateProfilePhoto(e)} />
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
        },
        writeProfilePhoto: (user, blob) => {
            dispatch(write(`${user}/soc/photos/profile`, blob))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);

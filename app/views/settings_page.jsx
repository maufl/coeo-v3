import React from 'react';
import { connect } from 'react-redux';
import { Box, VBox } from 'react-layout-components';
import { Card, CardText, CardTitle } from 'material-ui/lib/card';
import TextField from 'material-ui/lib/TextField';

import { maybeGet, update } from '../state/objects';

import UpdateableImage from '../components/updateable_image';


class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
        let {
            me: { data: { fullName } ={} } ={},
            motto: { data: motto } ={},
        } = this.props;
        this.state = {
            fullName,
            motto,
        };
    }

    componentWillMount() {
        this.props.loadSocial(this.props.user);
    }

    render() {
        let {
            user,
            isPhone
        } = this.props;
        return (
            <div style={{maxWidth: 900, width: isPhone ? '100%' : null, margin: '8px auto'}}>
                <Card style={{width: "100%", marginTop: 16}}>
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
                <Card style={{width: "100%", marginTop: 16}}>
                    <CardTitle actAsExpander={true} showExpandableButton={true} title="Photos" />
                    <CardText expandable={true}>
                        <Box justifyContent="space-around">
                            <VBox>
                                <h5>Profile photo</h5>
                                <UpdateableImage imageURL={`${user}/soc/photos/profile`} maxWidth={300} maxHeight={300} />
                            </VBox>
                            <VBox>
                                <h5>Cover photo</h5>
                                <UpdateableImage imageURL={`${user}/soc/photos/cover`} maxWidth={300} maxHeight={300} />
                            </VBox>
                        </Box>
                    </CardText>
                </Card>
            </div>
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
        isPhone: state.responsive.isPhone
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadSocial: (user) => {
            dispatch(maybeGet(user+'/soc/me'));
            dispatch(maybeGet(user+'/soc/me/motto'));
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

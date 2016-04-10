import React from 'react';
import { connect } from 'react-redux';

import TextField from 'material-ui/lib/TextField';
import RaisedButton from 'material-ui/lib/raised-button';
import Avatar from 'material-ui/lib/avatar';
import SocialPerson  from 'material-ui/lib/svg-icons/social/person';

import { VBox } from 'react-layout-components';

import { login } from '../state/session';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            password: props.password
        };
    }

    login() {
        this.props.login(
            this.state.user,
            this.state.password
        )
    }

    render() {
        return (
            <VBox fit alignItems="center" alignSelf="center" justifyContent="center">
                <Avatar icon={<SocialPerson />} /><br />
                <TextField
                    floatingLabelText="User name"
                    value={this.state.user}
                    onChange={(e) => {this.setState({user: e.target.value})}}/>
                <br />
                <TextField
                    floatingLabelText="Password"
                    type="password"
                    value={this.state.password}
                    onChange={(e) => {this.setState({password: e.target.value})}} />
                <br />
                <RaisedButton primary={true} label="Login" onMouseUp={()=>{this.login()}}/><br />
            </VBox>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.session.user
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (user, password) => dispatch(login(user, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
